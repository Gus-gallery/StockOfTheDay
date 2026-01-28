import Card from './components/Card'

function App() {

  return (
    <>
      <div className="flex flex-col items-center justify-center p-4 mt-12">
        <h2 className="text-3xl font-classic text-gray-400">
          Today's
        </h2>
        <h1 className="text-5xl font-classicBold text-gray-300 ">
          Stock of The Day
        </h1>
        <Card />
      </div>
    </>
  )
}

export default App
