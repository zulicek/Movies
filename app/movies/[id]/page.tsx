import MoviePage from '@/src/pages/MoviePage'

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const id = (await params).id
  return <MoviePage id={id} />
}