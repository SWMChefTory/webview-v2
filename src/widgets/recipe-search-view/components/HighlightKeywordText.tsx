interface HighlightKeywordTextProps {
  text: string;
  keyword: string;
}

export const HighlightKeywordText = ({
  text,
  keyword,
}: HighlightKeywordTextProps) => {
  const keywordIndex = text.toLowerCase().indexOf(keyword.toLowerCase());
  
  if (keywordIndex === -1) {
    return <span>{text}</span>;
  }
  
  const before = text.substring(0, keywordIndex);
  const match = text.substring(keywordIndex, keywordIndex + keyword.length);
  const after = text.substring(keywordIndex + keyword.length);

  return (
    <>
      {before}
      <span className="text-orange-600 font-semibold">{match}</span>
      {after}
    </>
  );
};

