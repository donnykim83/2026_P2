type Props = {
  result: string;
};

export default function ResultView({ result }: Props) {
  return (
    <div className="result">
      <h2>풀이 결과</h2>
      <p className="result__text">{result}</p>
      <p className="result__disclaimer">
        ※ 이 콘텐츠는 오락 목적이며, 얼굴 특징으로 성격이나 운명을 판단하는 것은 과학적으로 검증되지 않았습니다.
      </p>
    </div>
  );
}
