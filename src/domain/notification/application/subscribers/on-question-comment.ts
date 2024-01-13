/* eslint-disable @typescript-eslint/no-empty-function */
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { QuestionCommentEvent } from '@/domain/forum/enterprise/events/question-comment-event'

export class OnQuestionComment implements EventHandler {
  constructor(
    private questionRepository: QuestionRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.questionCommentNotification.bind(this), // faz com que o this seja referencia a classe incial sempre, mesmo que a função seja chamada dentro de outra classe
      QuestionCommentEvent.name,
    )
  }

  private async questionCommentNotification({
    questionComment,
  }: QuestionCommentEvent) {
    const question = await this.questionRepository.findById(
      questionComment.questionId.toString(),
    )

    if (question) {
      await this.sendNotification.execute({
        recipientId: question?.authorId.toString(),
        title: `Novo Comentário criado na pergunta "${question.title
          .substring(0, 40)
          .concat('...')}"`,
        content: question.excerpt,
      })
    }
  }
}
