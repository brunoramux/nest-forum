export class Slug {
  public value: string

  constructor(value: string) {
    this.value = value
  }
  /**
   * "An example Text"
   * @param text
   * @returns
   */

  // método que normaliza uma string como um slug
  static createFromText(text: string) {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase() // minusculo
      .trim() // tira espaços
      .replace(/\s+/g, '-') // s = whitespace. Substitui espaços em branco por string vazia
      .replace(/[^\w-]+/g, '') // \w = todas as palavras, + = um ou mais vezes. O que não são palavras serão substituidos por string vazia. g = global
      .replace(/_/g, '-') // remove underline e substitui por hífen
      .replace(/--+/g, '-') // tira lugares onde aparecem dois hífens e troca por um só
      .replace(/-$/g, '') // $ = final da string. Substitui hifem do final por string vazio

    return new Slug(slugText)
  }
}
