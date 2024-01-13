/* eslint-disable @typescript-eslint/no-empty-function */
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { AnswersRepository } from '@/domain/forum/application/repositories/answer-repository'
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event'

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answerRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this), // faz com que o this seja referencia a classe incial sempre, mesmo que a função seja chamada dentro de outra classe
      QuestionBestAnswerChosenEvent.name,
    )
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answerRepository.findById(bestAnswerId.toString())

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer?.authorId.toString(),
        title: 'Sua Resposta foi escolhida',
        content: `A resposta que você enviou em "${question.title}" foi escolhida pelo autor como a melhor!`,
      })
    }
  }
}
