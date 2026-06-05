export type TranslationResult = {
  text: string;
  billedCharacters: number;
};

export type Translator = {
  translate: (
    text: string,
    from: string,
    to: string,
  ) => Promise<TranslationResult>;
};
