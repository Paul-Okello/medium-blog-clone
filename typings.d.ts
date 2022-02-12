export interface Post {
  _createdAt: string
  _id: string
  _rev: string
  _type: string
  _updatedAt: string
  author: {
    _ref: string
    name: string
    image: string
  }
  body: [object]
  description: string
  mainImage: {
    _type: string
    asset: {
      url: string
    }
  }
  slug: {
    current: string
  }
  title: string
  comments: Comment[]
}

export interface Comment {
  approved: boolean
  comment: string
  email: string
  name: string
  post: {
    _ref: string
    _type: string
  }
  _createdAt: string
  _id: string
  _rev: string
  _type: string
  _updatedAt: string
}
