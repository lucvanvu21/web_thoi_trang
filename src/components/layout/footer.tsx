import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const FooterC = () => {
  return (
    <footer className="bg-gray-100 text-black py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cột 1: Giới thiệu */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Về chúng tôi</h3>
            <p className="text-sm text-gray-700">
              Chúng tôi là thương hiệu thời trang hàng đầu, mang đến những sản phẩm chất lượng và phong cách độc đáo.
            </p>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-gray-700 hover:text-gray-600/60 transition-colors">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="/san-pham-moi" className="text-sm text-gray-700 hover:text-gray-600/60 transition-colors">
                  Sản phẩm mới
                </a>
              </li>
              <li>
                <a href="/huong-dan-mua-hang" className="text-sm text-gray-700 hover:text-gray-600/60 transition-colors">
                Hướng dẫn mua hàng
                </a>
              </li>
             
            </ul>
          </div>

          {/* Cột 3: Thông tin liên hệ */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-700">Email: support@hangthoitrang.com</li>
              <li className="text-sm text-gray-700">Điện thoại: +84 123 456 789</li>
              <li className="text-sm text-gray-700">Địa chỉ: Quyết Thắng, Thái Nguyên, Việt Nam</li>
            </ul>
          </div>

        
        </div>

        {/* Phần mạng xã hội và bản quyền */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="#" className="text-gray-700 hover:text-gray-600/60 transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-600/60 transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-600/60 transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-600/60 transition-colors">
              <Youtube size={20} />
            </a>
          </div>
          <p className="text-sm text-gray-700">&copy; {new Date().getFullYear()} HANGTHOITRANG. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterC;
