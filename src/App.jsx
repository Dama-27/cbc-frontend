import './App.css'
import Header from './components/header'
import ProductCard from './components/productaCard'

function App() {

  return (
    <>
      <Header/>
      <ProductCard name="dada dada dadad dada" description="lorem lorem lorem" price="$1000/=" picture={"https://picsum.photos/id/1/200/300"}/>
      <ProductCard name="Apple laptop" description="wadak na" price="1000/=" picture={"https://picsum.photos/id/2/200/300"}/>
      <ProductCard name="MSI laptop" description="wadak na" price="1000/=" picture={"https://picsum.photos/id/3/200/300"}/>
      <ProductCard/>
    </>
  )
}

export default App
