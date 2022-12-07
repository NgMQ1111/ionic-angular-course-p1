// export interface Place {
//   id: string;
//   title: string;
//   description: string;
//   imageUrl: string;
//   price: number;
// }

export class Place {
  constructor(
    public id?: string,
    public title?: string,
    public description?: string,
    public imageUrl?: string,
    public price?: number,
    public availabelFrom?: Date,
    public availabelTo?: Date,
    public userId?: string
  ) {}
}
