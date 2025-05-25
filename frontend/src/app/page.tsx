'use client';
import { useEffect, useState } from "react";
var page=0
var sortString: string = "";
var search: Array<string> = [];
export default function Home() {
  const[productList, setProductList] = useState([]);
  const[productPageCount, setProductPageCount] = useState(0);
  const[productCurrentPage, setProductCurrentPage] = useState(0);
  const[productFullList, setProductFullList] = useState([]);
  const getProducts = async (page: number, sort?: string, search?: string) =>{
    try{
      let url = `http://localhost:9090/products?page=${page}`;
      if (sort) {
        url += `&sort=${sort}`;
        sortString = sort;}
      if (search) {
        search = search;}
      const response = await (await fetch(url)).json();
      console.log("Fetched products:", response);
      setProductList(response.pageList);
      setProductPageCount(response.pageCount);
      setProductCurrentPage(response.currentPage);
      setProductFullList(response.source);
      pagination()
    }catch (error){
      console.error("Error fetching products:", error);
    }
  }

  interface categoryStats {
    name: string,
    totalStock: number,
    totalPrice: number
  }

  
  const productRows = productList.map((product:any) => {
    return (
    <tr key={product.productId}>
      <td style={{ border: "1px solid gray", textAlign:"center"}}><input type="checkbox"></input></td>
      <td style={{ border: "1px solid gray", textAlign:"center"}}>{product.category}</td>
      <td style={{ border: "1px solid gray", textAlign:"center"}}>{product.name}</td>
      <td style={{ border: "1px solid gray", textAlign:"center"}}>{product.unitPrice}</td>
      <td style={{ border: "1px solid gray", textAlign:"center"}}>{product.expirationDate.toString()}</td>
      <td style={{ border: "1px solid gray", textAlign:"center"}}>{product.stock}</td>
      <td style={{ border: "1px solid gray", textAlign:"center"}}><button><strong>Edit</strong></button>/<button><strong>Delete</strong></button></td>
    </tr>
    );
  });

  let categories = new Map<string, categoryStats>();
  const categoriesMapping = productFullList.map((product:any) => {
    const categoryStat = categories.get(product.category);
    if (!categoryStat) {
      console.log("Adding category:", product.category);
      categories.set(product.category, {
        name: product.category,
        totalStock: product.stock,
        totalPrice: product.unitPrice * product.stock
      });
    }
    else {
      console.log("Updating category:", product.category);
      console.log(product.category,"from", categoryStat.totalStock,"to", categoryStat.totalStock + product.stock);
      categoryStat.totalStock += product.stock;
      categoryStat.totalPrice += product.unitPrice * product.stock;
    }
  });
  categoriesMapping;
  const categoryRows = Array.from(categories.values()).map((categoryStat: categoryStats) => {
    console.log("Adding rows:", categories);
    return(
      <tr key={categoryStat.name}>
        <td style={{textAlign:"center"}}>{categoryStat.name}</td>
        <td style={{textAlign:"center"}}>{categoryStat.totalStock}</td>
        <td style={{textAlign:"center"}}>{categoryStat.totalPrice}</td>
        <td style={{textAlign:"center"}}>{(categoryStat.totalPrice / categoryStat.totalStock).toFixed(2)}</td>
      </tr>
    );
  });

  useEffect(() => {
    getProducts(page);
  }, []);
  
  const pagination = () => {
    const pages = [];
    for (let i = 0; i < productPageCount; i++) {
      pages.push(
        i === productCurrentPage ? (
        <button key={i} onClick={() => getProducts(i,sortString)} style={{color: "blue", fontWeight: "bold", WebkitTextFillColor: "blue"}}>
          {i + 1}
        </button>
        ) : (
          <button key={i} onClick={() => getProducts(i,sortString)}>
            {i + 1}
          </button>
        )
      );
    }
    return pages;
  }

  const getCategories = Array.from(categories.values()).map((category) => {
    return (
      <option key={category.name} value={category.name}>
        {category.name}
      </option>
    );
  });
  
  return (
    <main>
      <div
        className="SearchBlock"
        style={{ width: "98%", height: "155px", margin: "1%" }}>
        <form style={{border: "1px solid black", width:"100%", maxWidth: "500px", height:"100%", marginLeft: "auto",marginRight:"auto",textAlign:"center"}}>
          <label htmlFor="name" style={{width:"300px", marginLeft:"auto",marginRight:"auto",}}>Name</label>
          <input type="text" id="name" name="name" style={{ border: "1px solid black" , width:"35%", maxWidth: "200px", height: "25px", marginLeft:"2%", marginTop: "10px"}}></input><br></br>
          <label htmlFor="categories" style={{width:"300px", textAlign:"center"}}>Category</label>
          <select id="categories" name="categories" style={{ border: "1px solid black", width:"30%", maxWidth: "300px", height: "25px", marginLeft:"2%", marginTop: "10px"}}>{getCategories}</select><br></br>
          <label htmlFor="availability" style={{width:"300px", textAlign:"center"}}>Availability</label>
          <select id="availability" name="availability" style={{ border: "1px solid black", width:"28%", maxWidth: "500px",height:"25px", marginLeft:"2%", marginTop: "10px"}}>
            <option value="outOfStock">Out of Stock</option>
            <option value="inStock">In Stock</option>
            <option value="all">All</option>  
          </select><br></br>
          <button type="submit" style={{border: "1px solid black",width: "120px", height:"25px", marginTop: "10px", textAlign:"center", marginLeft: "auto",marginRight:"auto"}}>Search</button>
        </form>
      </div>
      <div style={{width:"120px", marginLeft: "auto", marginRight: "auto",marginTop: "10px", marginBottom: "10px", textAlign: "center"}}>
        <input 
          type="submit" 
          value="New product" 
          style={{border: "1px solid black",width:"120px"}}>
        </input>
      </div>
      <div>
          <table style={{border: "1px solid black", width: "98%",maxWidth:"1000px", marginLeft: "auto",marginRight: "auto", fontSize: "14px"}}>
            <thead style={{border: "1px solid black"}}>
              <tr>
                <th scope="col" style={{border: "1px solid black", width: "5%",textAlign:"center"}}><input type="checkbox"></input></th>
                <th scope="col" style={{border: "1px solid black", width: "20%", margin: "10px", textAlign:"center"}}><button onClick={() => getProducts(page,"category")}>Category&lt;&gt;</button></th>
                <th scope="col" style={{border: "1px solid black", width: "25%", margin: "10px", textAlign:"center"}}><button onClick={() => getProducts(page,"name")}>Name&lt;&gt;</button></th>
                <th scope="col" style={{border: "1px solid black", width: "7.5%", margin: "10px", textAlign:"center"}}><button onClick={() => getProducts(page,"unitPrice")}>Price&lt;&gt;</button></th>
                <th scope="col" style={{border: "1px solid black", width: "25%", margin: "10px", textAlign:"center"}}><button onClick={() => getProducts(page,"expirationDate")}>Expiration Date&lt;&gt;</button></th>
                <th scope="col" style={{border: "1px solid black", width: "7.5%", margin: "10px", textAlign:"center"}}><button onClick={() => getProducts(page,"stock")}>Stock&lt;&gt;</button></th>
                <th scope="col" style={{border: "1px solid black", width: "20%", margin: "10px", textAlign:"center"}}>Actions&lt;&gt;</th>
              </tr>
            </thead>
            <tbody style={{border: "1px solid black", width: "98%", fontSize: "14px"}}>
                {productRows}
            </tbody>
          </table>
        <div style={{border: "1px solid black", width: "50%", maxWidth: "300px" , height: "25px", marginLeft: "auto", marginRight: "auto", marginTop: "10px", textAlign: "center"}}>
            {pagination()}
        </div>
      </div>
      <div>
        <table style={{border: "1px solid black", width: "98%", maxWidth:"1000px", maxHeight:"200px", marginTop: "10px", marginLeft: "auto", marginRight: "auto", textAlign: "center", fontSize: "13px"}}>
          <thead>
            <tr>
              <th style={{width: "22%",textAlign:"center"}}>Category</th>
              <th style={{width: "22%",textAlign:"center"}}>Total product in Stock</th>
              <th style={{width: "22%",textAlign:"center"}}>Total value in Stock</th>
              <th style={{width: "22%",textAlign:"center"}}>Average price in Stock</th>
            </tr>
          </thead>
          <tbody>
            {categoryRows}
          </tbody>
        </table>
      </div>
    </main>
    
  );
}

