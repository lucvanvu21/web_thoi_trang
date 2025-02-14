import { AttributeValueBodyType, CreateAttributeType } from '@/types/categorySchema';
import { AttributeValueType } from '@/types/indexType';
import { http } from '@/utils/actions';

export const attributeReq = {
  getAll: async <T>(accessToken: string) => {
    return await http.get<T>('admin/attribute', {
      cache: { next: { tags: ['list-att'] } },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  createAttribute: async <T>(accessToken: string, body: CreateAttributeType) => {
    return await http.post<T>(
      'admin/attribute',
      { body },
      {
        tags: ['list-att'],
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  },
  deleteAttribute: async <T>(accessToken: string, id: number) => {
    return await http.delete<T>(`admin/attribute/${id}`, {
      tags: ['list-att'],
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  updateAttribute: async <T>(accessToken: string, body: CreateAttributeType, id: number) => {
    return await http.patch<T>(
      `admin/attribute/${id}`,
      { body },
      {
        tags: ['list-att'],
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  },
  createAttValue: async <T>(accessToken: string, body: AttributeValueBodyType) => {
    return await http.post<T>(
      'admin/attribute-value',
      { body },
      {
        tags: ['list-att'],
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  },
  updateAttValue: async <T>(accessToken: string, body: AttributeValueBodyType, id: number) => {
    return await http.patch<T>(
      `admin/attribute-value/${id}`,
      { body },
      {
        tags: ['list-att'],
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  },
  delAttrValue: async <T>(accessToken: string, id: number) => {
    return await http.delete<T>(`admin/attribute-value/${id}`, {
      tags: ['list-att'],
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
};
