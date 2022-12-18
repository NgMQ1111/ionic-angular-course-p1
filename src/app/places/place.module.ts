// export interface Place {
//   id: string;
//   title: string;
//   description: string;
//   imageUrl: string;
//   price: number;
// }

export class Place {
  constructor(
    public id: string | null,
    public title: string  | null,
    public description: string | null,
    public imageUrl: string | null,
    public price: number | null,
    public availabelFrom: Date | null,
    public availabelTo: Date | null,
    public userId: string | null
  ) {}
}
