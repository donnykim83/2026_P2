type Photo = {
  imageUrl: string;
  pageUrl: string;
  title: string;
};

type Props = {
  actorName: string;
  reason: string;
  photo: Photo | null;
};

export default function ActorMatchResult({ actorName, reason, photo }: Props) {
  return (
    <div className="result">
      <h2>어울리는 배우자 이미지</h2>
      {photo ? (
        <a
          href={photo.pageUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="actor-match__photo-link"
        >
          <img src={photo.imageUrl} alt={actorName} className="actor-match__photo" />
        </a>
      ) : (
        <p className="actor-match__no-photo">사진을 찾지 못했어요.</p>
      )}
      <p className="actor-match__name">{actorName}</p>
      <p className="result__text">{reason}</p>
      {photo && (
        <p className="actor-match__credit">
          사진 출처:{" "}
          <a href={photo.pageUrl} target="_blank" rel="noreferrer noopener">
            위키피디아 - {photo.title}
          </a>
        </p>
      )}
      <p className="result__disclaimer">
        ※ 이 콘텐츠는 오락 목적이며, 추천된 배우 개인과는 무관하고 실제 인연이나 궁합을 의미하지 않습니다.
      </p>
    </div>
  );
}
