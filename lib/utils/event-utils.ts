export function suppressEvent(e: React.MouseEvent<HTMLElement> | React.SubmitEvent<HTMLFormElement> | Event) {
  e.preventDefault();
  e.stopPropagation();
}
