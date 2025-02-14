'use client';
import { ProductType, VariantType } from '@/types/indexType';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from './ui/carousel';
import Image from 'next/image';
import Fade from 'embla-carousel-fade';
import { useCartStore } from '@/app/store/cartStore';
import { toast } from '@/hooks/use-toast';
const ProductCom = ({ product }: { product: ProductType }) => {
  // console.log(product);
  const [quantity, setQuantity] = useState(1);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selected, setSelected] = useState<VariantType>();
  const addToCart = useCartStore(state => state.addItemToCart);
  const items = useCartStore(state => state.cart);

  useEffect(() => {
    if (product) {
      const availableVariants = product.variants.filter(v => v.quantity > 0);

      // Chọn variant đầu tiên có hàng
      const firstAvailableVariant = availableVariants.length > 0 ? availableVariants[0] : product.variants[0];

      setSelected(firstAvailableVariant);

      const color = firstAvailableVariant?.attributeValues.find(at => at.attribute.name === 'color')?.value;
      setSelectedColor(color);

      if (!color) {
        const size = product.variants.find(v => v.quantity > 0)?.attributeValues.find(at => at.attribute.name === 'size')?.value;
        setSelectedSize(size);
      }
    }
  }, [product]);
  const uniqueColors = Array.from(
    new Set(
      product.variants
        .flatMap(v => v.attributeValues)
        .filter(at => at.attribute.name === 'color')
        .map(at => at.value)
    )
  );
  const sizeOrder = ['S', 'M', 'L', 'XL'];

  const uniqueSizes = Array.from(
    new Set(
      product.variants
        .flatMap(v => v.attributeValues)
        .filter(at => at.attribute.name === 'size')
        .map(at => at.value)
    )
  );
  // Phân loại size chữ và số
  const textSizes = uniqueSizes.filter(size => isNaN(Number(size))).sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b));
  const numberSizes = uniqueSizes.filter(size => !isNaN(Number(size))).sort((a, b) => Number(a) - Number(b));
  // Gộp lại danh sách size sau khi sắp xếp
  const sortedSizes = [...textSizes, ...numberSizes];
  // console.log('sortedSizes', sortedSizes);
  const availableSizes = selectedColor
    ? product.variants
        .filter(v => v.attributeValues.some(at => at.attribute.name === 'color' && at.value === selectedColor))
        .flatMap(v => v.attributeValues)
        .filter(at => at.attribute.name === 'size')
        .map(at => at.value)
    : [];
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));
  // console.log('--->', selectedColor);
  // console.log('availableSizes', availableSizes);
  const handleAddToCart = () => {
    const selectedVariant = selectedColor
      ? product.variants.find(
          v =>
            v.attributeValues.some(at => at.attribute.name === 'color' && at.value === selectedColor) &&
            v.attributeValues.some(at => at.attribute.name === 'size' && at.value === selectedSize)
        )
      : product.variants.find(v => v.attributeValues.some(at => at.attribute.name === 'size' && at.value === selectedSize));

    // console.log('selectedVariant', selectedVariant);
    if (!selectedVariant) {
      toast({
        title: 'Vui lòng chọn màu sắc và size hợp lệ',
        duration: 5000,
        variant: 'destructive',
      });
      return;
    }

    const variantId = selectedVariant.id;

    const currentVariant = items.find(i => i.variantId === variantId);
    if (!currentVariant) {
      const newItem = {
        variantId,
        quantity: quantity,
        productId: product.id,
        name: product.name,
        price: selected?.price,
        image: product.images[0]?.url,
      };

      addToCart(newItem);
      toast({
        title: 'Sản phẩm đã được thêm vào giỏ hàng',
        description: product.name,
        duration: 5000,
      });
      return;
    }
    if (currentVariant.quantity + quantity > 5) {
      toast({
        title: 'Số lượng sản phẩm vượt quá giới hạn',
        duration: 5000,
      });
      return;
    }
    const newItem = {
      variantId,
      quantity: quantity,
    };

    addToCart(newItem);
    toast({
      title: 'Sản phẩm đã được thêm vào giỏ hàng',
      description: product.name,
      duration: 5000,
    });
  };
  return (
    <div>
      <div className=" mt-[70px] max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-20 text-black">
        {/* Left side - Product Images */}
        <div className="space-y-4">
          <Carousel
            opts={{
              loop: true,
              duration: 100,
            }}
            plugins={[Fade()]}
          >
            <CarouselContent className="m-0 p-0 ">
              {Array.from(product?.images).map((item, index) => (
                <CarouselItem key={item?.id}>
                  <div>
                    <Card className="rounded-none">
                      <CardContent className="flex items-center justify-center p-0 relative">
                        <Image
                          src={item?.url}
                          alt={`${item?.publicId}`}
                          width={0}
                          height={0}
                          sizes="100vw"
                          quality={90}
                          loading={index === 0 ? 'eager' : 'lazy'}
                          priority={index === 0}
                          style={{
                            objectFit: 'cover',
                            borderRadius: '0.5rem',
                            width: '100%',
                            height: 'auto',
                            maxHeight: '750px',
                          }}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselDots
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2  md:bottom-6 md:left-6 md:-translate-x-0 "
              thumbnails={product?.images}
              height={24}
              width={20}
            />
          </Carousel>
        </div>

        {/* Right side - Product Info */}
        <div className="space-y-6">
          <div>
            {/* <h1 className="text-2xl font-bold">21ST URBAN</h1> */}
            <h2 className="text-xl"> {product?.name}</h2>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold">{product?.variants[0]?.price?.toLocaleString('vi-VN')}₫</span>

            {/* <span className="text-gray-500 line-through">820,000₫</span> */}
          </div>

          <div>
            {uniqueColors.length > 1 && (
              <>
                <h3 className="my-2">Chọn màu sắc:</h3>
                <div className="space-x-2">
                  {uniqueColors.map(color => (
                    <Button
                      key={color}
                      className={`attribute-item ${color === selectedColor ? 'bg-black text-white' : ''}`}
                      variant={color === selectedColor ? 'default' : 'outline'}
                      onClick={() => {
                        setSelectedColor(color);
                        setSelectedSize(null); // Reset size khi chọn màu mới
                      }}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </>
            )}

            <h3 className="my-2">Chọn size:</h3>
            <div className="space-x-2">
              {sortedSizes.map(size => {
                const matchingVariant = product?.variants.find(
                  variant =>
                    availableSizes.includes(size) &&
                    variant.attributeValues.some(attr => attr.attribute.name === 'size' && attr.value === size) &&
                    variant.quantity > 0
                );
                // console.log('matchingVariant', matchingVariant);
                const dk2 = product?.variants.find(
                  variant =>
                    variant.attributeValues.some(attr => attr.attribute.name === 'size' && attr.value === size) &&
                    variant.quantity > 0
                );
                // console.log('dk2', dk2);
                const isDisabled = selectedColor ? !matchingVariant : dk2 ? false : true;
                return (
                  <Button
                    key={size}
                    className={`${isDisabled ? 'hover:bg-inherit' : ''} ${size === selectedSize ? 'bg-black text-white' : ''} ${
                      isDisabled ? 'line-through ' : ''
                    }`}
                    variant={size === selectedSize ? 'default' : 'outline'}
                    onClick={() => !isDisabled && setSelectedSize(size)}
                    disabled={isDisabled}
                  >
                    {size}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="flex items-center space-x-2 border border-gray-300 w-fit ">
            <Button variant="ghost" size="icon" onClick={decrementQuantity} className="h-10 w-10  ">
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center  ">{quantity}</span>
            <Button variant="ghost" size="icon" onClick={incrementQuantity} className="h-10 w-10 ">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Add to Cart Button */}
          <Button className="w-full h-12 text-lg bg-black text-white" onClick={() => handleAddToCart()}>
            Thêm Vào Giỏ Hàng
          </Button>

          {/* Product Details */}
          {product?.description && (
            <Card>
              <CardContent className="pt-6">
                <div>
                  {product?.description?.split('-').map((line, index) => (
                    <p key={index}> {line}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCom;
