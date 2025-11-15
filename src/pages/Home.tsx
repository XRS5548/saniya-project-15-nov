import  {  useEffect, useState } from 'react'
import FilterBar from '../components/Home/FilterBar'
import Products from '../components/Home/Products';
import { getCategories } from '../api/products';

export default function Home() {
  const [category,setCategory] = useState("")
  const [categorys,setCategorys] = useState  <string[]|null >([])

  useEffect(()=>{
     getCategories().then((cats)=>{
        setCategorys(cats)
     });
  },[])
  
  return  (
    <div>
      
      <h1></h1>
      <div id="products">
      <FilterBar categories={categorys!} onFilter={(cat) =>setCategory(cat)} />
      {(category && category !="")?<Products category={category} /> :<Products />}
      </div>
    </div>
  )
}
