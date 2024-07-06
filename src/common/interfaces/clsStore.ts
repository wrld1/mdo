import { ClsStore } from 'nestjs-cls';

export interface MyClsStore extends ClsStore {
  userId: number;
}
