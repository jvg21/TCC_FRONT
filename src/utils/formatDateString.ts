// Função para formatar a data com suporte a localidade e opções de formatação
export const formatDateString = (
  dateString: string,
  locale: string = 'pt-BR',
  options?: Intl.DateTimeFormatOptions
) => {
  if (!dateString || dateString === "0001-01-01T00:00:00") return "-";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  return date.toLocaleDateString(locale, options);
};
