export function suppressEvent(e: React.MouseEvent<HTMLElement> | React.SubmitEvent<HTMLFormElement>) {
  e.preventDefault();
  e.stopPropagation();
}
