import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class CommentPresenter {
  static toHTTP(comment: Comment<any>) {
    return {
      id: comment.id.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }
}
