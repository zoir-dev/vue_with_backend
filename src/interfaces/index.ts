export interface IPost {
  _id: string
  title: string
  body: string
  img: string
  createdAt: string
  author: string
}

export interface IUser {
  email: string
  password: string
  id: string
}
