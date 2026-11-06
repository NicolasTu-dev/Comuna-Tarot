export function StarField() {
  return (
    <div className="star-field" aria-hidden="true">
      <div className="star-field__nebula star-field__nebula--one" />
      <div className="star-field__nebula star-field__nebula--two" />
      <div className="star-field__layer" />
      <div className="star-field__layer star-field__layer--slow" />
      <div className="star-field__shooting-star star-field__shooting-star--one" />
      <div className="star-field__shooting-star star-field__shooting-star--two" />
    </div>
  );
}
