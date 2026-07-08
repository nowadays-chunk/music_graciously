import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

function normalizeArticleKey(slug) {
  return String(slug || '').replace(/-analysis$/, '');
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const key = normalizeArticleKey(params?.slug);
  const data = songData[key];

  if (!data) {
    return { notFound: true };
  }

  return {
    props: { data },
    revalidate: 60,
  };
}

export default function JazzAnalysisPage({ data }) {
  return <JazzArticleTemplate data={data} />;
}
