'use client';
import { useEffect, useState } from "react";
import Select from "react-select";
let sortString: string = "";
let searchNameGlobal: string;
let searchCategoryGlobal: Array<string>;
let searchAvailabilityGlobal: string;

export default function Home() {

  /** Function that fetches the list of products 
   * that are going to appear on the table. */
  const[productList, setProductList] = useState<Product[]>([]);
  const[productPageCount, setProductPageCount] = useState(0);
  const[productCurrentPage, setProductCurrentPage] = useState(0);
  const getProducts = async (page: number, sort?: string, searchName?:string, searchCategory?: Array<string>, searchAvailability?: string) =>{
    try{
      let url = `http://localhost:9090/products?page=${page}`;
      if (sort) {
        url += `&sort=${sort}`;
        sortString = sort;}
      if (searchName !== undefined && searchName !== "") url += `&searchName=${searchName}`
      if (searchCategory !== undefined && searchCategory.length) url += `&searchCategory=${searchCategory}`
      searchAvailability !== undefined && searchAvailability !=="" ? url += `&searchAvailability=${searchAvailability}` : url += "&searchAvailability=All"
      console.log("Fetching products from URL:", url);
      const response = await (await fetch(url)).json();
      console.log("Fetched products:", response);
      setProductList(response.pageList);
      setProductPageCount(response.pageCount);
      setProductCurrentPage(response.page);
      pagination();
      getProductStats();
    }catch (error){
      console.error("Error fetching products:", error);
    }
  }

  /** Interface to create the product that we are going to send to the database. */
  interface Product {
    productId?: string;
    name: string,
    category: string,
    unitPrice: number,
    stock: number,
    expirationDate?: string,
    creationDate?: string,
    lastUpdate?: string
  }

  /** Function that fetches the complete list of products in the database,
   * regardless of the page and search parameters, for use 
   * on the category statistics table. */
  const[productFullList, setProductFullList] = useState([]);
  const getProductStats = async () =>{
    try{
      let url = "http://localhost:9090/products?page=0&searchAvailability=All";
      const response = await (await fetch(url)).json();
      console.log("Fetched products for category stats:", response);
      setProductFullList(response.source);
    }catch (error){
      console.error("Error fetching products for category stats:", error);
    }
    
  }

  /** Object that uses the fetched full list of products and creates
   * the models through the interface categoryStats. */
  let categories = new Map<string, categoryStats>();
  const categoriesMapping = productFullList.map((product:any) => {
    const categoryStat = categories.get(product.category);
    if (!categoryStat) {
      categories.set(product.category, {
        name: product.category,
        totalStock: product.stock,
        totalPrice: product.unitPrice * product.stock
      });
    }
    else {
      categoryStat.totalStock += product.stock;
      categoryStat.totalPrice += product.unitPrice * product.stock;
    }
  });

  /** Run categoriesMapping, and with the models created for every category
   * we map them into the table in HTML. */
  categoriesMapping;
  const categoryRows = Array.from(categories.values()).map((categoryStat: categoryStats) => {
    return(
      <tr key={categoryStat.name}>
        <td style={{textAlign:"center"}}>{categoryStat.name}</td>
        <td style={{textAlign:"center"}}>{categoryStat.totalStock}</td>
        <td style={{textAlign:"center"}}>{categoryStat.totalPrice}</td>
        <td style={{textAlign:"center"}}>{categoryStat.totalStock==0 ? 0 : (categoryStat.totalPrice / categoryStat.totalStock).toFixed(2)}</td>
      </tr>
    );
  });

  /** Function that sends a request to the database to change the stock
   * number of the requested product */
  async function setProductStock(product: Product, checkboxState: boolean, productId: string){
    try{
      const fetchURL: string = checkboxState == true ? `http://localhost:9090/products/${productId}/outofstock` : `http://localhost:9090/products/${productId}/instock`;
      const response = await fetch(fetchURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      const result = await response.json();
      setProductList((prevList: any[]) =>
        prevList.map((p) =>
          String(p.productId) === String(productId)
            ? { ...p, stock: result.stock } // update stock with the value returned by the API
            : p
        )
      );
      getProductStats();
      return result;
    }
    catch(error){
      console.error('Error sending data:',error);
      throw new Error('Failed to send data');
    }
  }

  const [showEditModal, setShowEditModal] = useState(false);
  const closeEditModal = () => {setShowEditModal(false);setEditingProductId(null);}
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  /** Functions that handle when checkbox changes state. */
  const [checkedProducts, setCheckedProducts] = useState<string[]>([]);
  const handleProductCheckbox=(e: React.ChangeEvent<HTMLInputElement>)=>{
    const productId = e.target.value;
    const checkboxState = e.target.checked;
    const product = productList.find((p: any) => String(p.productId) === productId);
    setCheckedProducts((prev) =>
    checkboxState
      ? [...prev, productId]
      : prev.filter((id) => id !== productId)
    );
    if (product) {
      setProductStock(product, checkboxState,productId);
    } else {
      console.warn("Product not found for id:", productId);
    }
  }
  const handleSelectAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (checked) {
      setCheckedProducts(productList.map((p) => String(p.productId)));
      productList.forEach((product) => {
        setProductStock(product, true, String(product.productId));
      });
    } else {
      setCheckedProducts([]);
        productList.forEach((product) => {
        setProductStock(product, false, String(product.productId));
      });
    }
  };
  
  async function sendEditedProduct(product: Product, productId: string){
    try{
      const response = await fetch(`http://localhost:9090/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      const result = await response.json();
      getProducts(productCurrentPage, sortString, searchNameGlobal, searchCategoryGlobal,searchAvailabilityGlobal);
      return result;
    }
    catch(error){
      console.error('Error sending data:',error);
      throw new Error('Failed to send data');
    }
  }

  const handleEditSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    let editedProduct: Product;
    const productId = id;
    const formData = new FormData(e.target as HTMLFormElement);
    let name = formData.get("name") as string;
    let category = formData.get("category") as string;
    let unitPrice = parseFloat(formData.get("unitPrice") as string);
    let stock = parseInt(formData.get("stock") as string, 10);
    console.log("Checking expiration date...");
    if(formData.get("expirationDate") != null){
        let expirationDate = formData.get("expirationDate") as string;
        const expirationDatePart1 = expirationDate.split('T')[0]
        const expirationDatePart2 = expirationDate.split('T')[1]
        expirationDate = expirationDatePart1+" "+expirationDatePart2;
        console.log(expirationDate);
        editedProduct = {
          name,
          category,
          unitPrice,
          stock,
          expirationDate
        };
      }
      else{
        console.log("No expiration date");
        editedProduct = {
        name,
        category,
        unitPrice,
        stock
        };
      }
    sendEditedProduct(editedProduct,productId);
    closeEditModal();
  }

  /** Variable and function to handle the new category check on the modal. */
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const handleCheckChange = () => {
    setShowCategoryInput((prev) => !prev);
  };

  /** Variable and function to handle the expiration date check on the modal. */
  const [showExpirationInput, setShowExpirationInput] = useState(false);
  const handleExpirationChange = () => {
    setShowExpirationInput((prev) => !prev);
  };

  
  const editProduct = (productId: string) => (
    <div 
        className="modal"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          {
          <div style={{ background: "#fff", padding: 24, borderRadius: 8, minWidth: 300 }}>
            <button onClick={closeEditModal} style={{ float: "right" }}>X</button>
            <form onSubmit={(e) => handleEditSubmit(e,productId)}>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" defaultValue={`${productList.find((p) => String(p.productId) === String(productId))?.name}`} style={{ border:"1px solid black", marginTop:"25px", marginLeft:"36px", width:"146.5px", height:"25px" }} required /><br></br>
              <label htmlFor="category">Category</label>
              {!showCategoryInput ? (
              <select id="category" name="category" defaultValue={`${productList.find((p) => String(p.productId) === String(productId))?.category}`} style={{ border:"1px solid black", marginTop:"10px", marginLeft:"14px", width:"146.5px", height:"25px" }} required>
                {getCategories}
              </select>
              ) : (
              <input id="category" name="category" defaultValue={`${productList.find((p) => String(p.productId) === String(productId))?.category}`} style={{ border:"1px solid black", marginTop:"10px", marginLeft:"14px", width:"146.5px", height:"25px" }} required/>
              )}
              <label>
                <input 
                  type="checkbox" 
                  id="check" 
                  checked={showCategoryInput}
                  onChange={handleCheckChange}
                  style={{marginLeft:"10px",marginRight:"3px"}}/>
                  New category
              </label><br></br>
              <label htmlFor="unitPrice">Unit Price</label>
              <input type="number" id="unitPrice" name="unitPrice" defaultValue={`${productList.find((p) => String(p.productId) === String(productId))?.unitPrice}`} style={{ border:"1px solid black", marginTop:"10px", marginLeft:"10px", width:"146px", height:"25px" }} required /><br></br>
              <label htmlFor="stock">Stock</label>
              <input type="number" id="stock" name="stock" defaultValue={`${productList.find((p) => String(p.productId) === String(productId))?.stock}`} style={{ border:"1px solid black", marginTop:"10px", marginLeft:"40px", width:"146px", height:"25px" }} required /><br></br>
              <label htmlFor="expirationDate">Expiration Date</label>
              {!showExpirationInput ? (
              <input type="datetime-local"  step="60" id="expirationDate" name="expirationDate" defaultValue={`${productList.find((p) => String(p.productId) === String(productId))?.expirationDate}`} style={{ border:"1px solid black", marginTop:"10px", marginLeft:"10px" }} required />
              ) : (
              <input type="datetime-local"  step="60" id="expirationDate" name="expirationDate" defaultValue={undefined} style={{ border:"1px solid black", marginTop:"10px", marginLeft:"10px" }} disabled/>
              )}
              <label>
                <input 
                  type="checkbox" 
                  id="check" 
                  checked={showExpirationInput}
                  onChange={handleExpirationChange}
                  style={{marginLeft:"10px",marginRight:"3px"}}/>
                  No Expiration Date
              </label><br></br>
              <br></br>
              <button type="submit" style={{ border:"1px solid black" ,width:"55px", marginTop:"10px"}}>Save</button>
            </form>
          </div>
          }
      </div>
  );

   const [showDeleteModal, setShowDeleteModal] = useState(false);
  const closeDeleteModal = () => {setShowDeleteModal(false);setDeletingProductId(null);}
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const deleteProduct = (productId: string) => (
    <div 
        className="modal"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          {
          <div style={{ background: "#fff", padding: 24, borderRadius: 8, minWidth: 300, textAlign:"center" }}>
            <button onClick={closeDeleteModal} style={{ float: "right" }}>X</button><br></br>
            <div style={{marginTop:"25px"}}>Are you sure you want to delete this product?</div><br></br>
            <button onClick={() => {
              fetch(`http://localhost:9090/products/${productId}`, {
                method: 'DELETE',
              })
              .then(response => {
                if (response.ok) {
                  console.log("Product deleted successfully");
                  getProducts(productCurrentPage, sortString, searchNameGlobal, searchCategoryGlobal,searchAvailabilityGlobal);
                  closeDeleteModal();
                } else {
                  console.error("Failed to delete product");
                }
              })
              .catch(error => console.error("Error deleting product:", error));
            }} style={{ width:"50px",textAlign:"center", backgroundColor:"red", color:"white", border:"1px solid black", marginTop:"25px" }}>Yes</button>
          </div>
          }
      </div>
  );

  /** Function that uses the fetched list of products
   * and maps it to the table in HTML. */
  const productRows = productList.map((product:any) => {
    let expirationDateValue: number | null = null; 
    if(product.expirationDate!=null){
      expirationDateValue = new Date(product.expirationDate).getTime();
    }
    return (
    <tr key={product.productId}>
      <td className="border border-gray-400 text-center"><input type="checkbox" value={product.productId} checked={checkedProducts.includes(String(product.productId))} onChange={handleProductCheckbox}></input></td>
      <td className="border border-gray-400 text-center">{product.category}</td>
      <td className="border border-gray-400 text-center">{product.name}</td>
      <td className="border border-gray-400 text-center">{product.unitPrice}</td>
      { expirationDateValue != null ? (
        expirationDateValue - Date.now() > 1123200000 ? (<td className="border border-gray-400 bg-green-300 text-center">{product.expirationDate.toString()}</td>) :
        expirationDateValue - Date.now() <= 1123199999 && expirationDateValue - Date.now() >= 518400001 ? (<td className="border border-gray-400 bg-orange-300 text-center">{product.expirationDate.toString()}</td>) :
        (<td className="border border-gray-400 bg-red-300 text-center">{product.expirationDate.toString()}</td>)
      ) :
        (<td className="border border-gray-400 text-center">N/A</td>)
      }
      { product.stock < 5 ? (<td className="border border-gray-400 bg-red-400 text-center">{product.stock}</td>) :
        product.stock >= 5 && product.stock <= 10 ? (<td className="border border-gray-400 bg-orange-300 text-center">{product.stock}</td>) :
        (<td className="border border-gray-400 text-center">{product.stock}</td>)
      }
      <td className="border border-gray-400 text-center"><button value={product.productId} onClick={() => setEditingProductId(product.productId)}><strong>Edit</strong></button>/<button onClick={() => setDeletingProductId(product.productId)}><strong>Delete</strong></button></td>
    </tr>
    );
  });

  /** Interface for creating models that keep track of the statistics 
   * of each category. */
  interface categoryStats {
    name: string,
    totalStock: number,
    totalPrice: number
  }

  /** Run the function to fetch the products for the main table. */
  useEffect(() => {
    getProducts(productCurrentPage);
  }, []);
  
  /** Function that handles the pagination buttons below the table */
  const pagination = () => {
    const pages = [];
    for (let i = 0; i < productPageCount; i++) {
      pages.push(
        i === productCurrentPage ? (
        <button key={i} className="text-blue-500 underline mr-auto ml-auto w-auto" onClick={() => getProducts(i,sortString,searchNameGlobal,searchCategoryGlobal,searchAvailabilityGlobal)}>
          <span>{i + 1}</span>
        </button>
        ) : (
          <button key={i} className="mr-auto ml-auto w-auto" onClick={() => getProducts(i,sortString,searchNameGlobal,searchCategoryGlobal,searchAvailabilityGlobal)}>
            {i + 1}
          </button>
        )
      );
    }
    return pages;
  }

  /** Object used to return the categories that exist. */
  const getCategories = Array.from(categories.values()).map((category) => {
    return (
      <option key={category.name} value={category.name}>
        {category.name}
      </option>
    );
  });
  
  /** Code that handles the parameters and style for the multi-select 
   * library. */
  const categoryOptions = Array.from(categories.values()).map(category => ({
    value: category.name,
    label: category.name
  }));

  /** Functions that handle the search parameters of the Search Block. */
  const [nameValue, setNameValue] = useState("");
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue(e.target.value);
    console.log("search name set to:", nameValue)
  };
  const [categoryValue, setCategoryValue] = useState<{ value: string; label: string }[]>([]);
  const handleCategoryChange = (selected: any) => {
    setCategoryValue(selected || []);
    console.log("search category(ies) set to:", selected ? selected.map((s: any) => s.value) : []);
  };
  const [availabilityValue, setAvailabilityValue] = useState("");
  const handleAvailabilityChange = (e: any) => {
    setAvailabilityValue(e.target.value);
    console.log("search availability set to:", availabilityValue)
  };

  /** function that handles the Search button and does the searching. */
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("fetching product list with the following parameters: Name=",nameValue," Category(ies)=",categoryValue," Availability=",availabilityValue)
    const selectedCategoryNames = categoryValue.map(c => c.value);
    searchCategoryGlobal = selectedCategoryNames;
    searchNameGlobal = nameValue;
    searchAvailabilityGlobal = availabilityValue;
    getProducts(productCurrentPage, sortString, nameValue, selectedCategoryNames, availabilityValue);
  };

  /** Variables and function for the New Product Modal. */
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const [showNewExpirationInput, setShowNewExpirationInput] = useState(false);
  const handleNewExpirationChange = () => {
    setShowNewExpirationInput((prev) => !prev);
  };

  /**Function that handles the modal creation and options. */
  const productModal = () => (
      <div 
        className="modal"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          {
          <div style={{ background: "#fff", padding: 24, borderRadius: 8, minWidth: 300 }}>
            <button onClick={closeModal} style={{ float: "right" }}>X</button>
            <form onSubmit={handleModalSubmit}>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" style={{ border:"1px solid black", marginTop:"25px", marginLeft:"36px", width:"146.5px", height:"25px" }} required /><br></br>
              <label htmlFor="category">Category</label>
              {!showCategoryInput ? (
              <select id="category" name="category" style={{ border:"1px solid black", marginTop:"10px", marginLeft:"14px", width:"146.5px", height:"25px" }} required>
                {getCategories}
              </select>
              ) : (
              <input id="category" name="category" style={{ border:"1px solid black", marginTop:"10px", marginLeft:"14px", width:"146.5px", height:"25px" }} required/>
              )}
              <label>
                <input 
                  type="checkbox" 
                  id="check" 
                  checked={showCategoryInput}
                  onChange={handleCheckChange}
                  style={{marginLeft:"10px",marginRight:"3px"}}/>
                  New category
              </label><br></br>
              <label htmlFor="unitPrice">Unit Price</label>
              <input type="number" id="unitPrice" name="unitPrice" style={{ border:"1px solid black", marginTop:"10px", marginLeft:"10px", width:"146px", height:"25px" }} required /><br></br>
              <label htmlFor="stock">Stock</label>
              <input type="number" id="stock" name="stock" style={{ border:"1px solid black", marginTop:"10px", marginLeft:"40px", width:"146px", height:"25px" }} required /><br></br>
              <label htmlFor="expirationDate">Expiration Date</label>
              {!showNewExpirationInput ? (
              <input type="datetime-local"  step="60" id="expirationDate" name="expirationDate" style={{ border:"1px solid black", marginTop:"10px", marginLeft:"10px" }} required />
              ) : (
              <input type="datetime-local"  step="60" id="expirationDate" name="expirationDate" style={{ border:"1px solid black", marginTop:"10px", marginLeft:"10px" }} disabled/>
              )}
              <label>
                <input 
                  type="checkbox" 
                  id="check" 
                  checked={showNewExpirationInput}
                  onChange={handleNewExpirationChange}
                  style={{marginLeft:"10px",marginRight:"3px"}}/>
                  No Expiration Date
              </label><br></br>
              <button type="submit" style={{ border:"1px solid black" ,width:"55px", marginTop:"10px"}}>Create</button>
            </form>
          </div>
          }
      </div>
  )

  /** Function that sends the created product to the database. */
  async function sendNewProduct(product: Product){
    try{
      const response = await fetch('http://localhost:9090/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      const result = await response.json();
      getProducts(productCurrentPage, sortString, searchNameGlobal, searchCategoryGlobal,searchAvailabilityGlobal);
      return result;
    }
    catch(error){
      console.error('Error sending data:',error);
      throw new Error('Failed to send data');
    }
  }

  /**Function that handles the Save button of the modal and sends
   * the new product information to the database. */
  const handleModalSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      let newProduct: Product;
      const formData = new FormData(e.target as HTMLFormElement);
      let name = formData.get("name") as string;
      let category = formData.get("category") as string;
      let unitPrice = parseFloat(formData.get("unitPrice") as string);
      let stock = parseInt(formData.get("stock") as string, 10);
      if(formData.get("expirationDate") != null){
        let expirationDate = formData.get("expirationDate") as string;
        const expirationDatePart1 = expirationDate.split('T')[0]
        const expirationDatePart2 = expirationDate.split('T')[1]
        expirationDate = expirationDatePart1+" "+expirationDatePart2+":00";
        newProduct = {
          name,
          category,
          unitPrice,
          stock,
          expirationDate
        };
      }
      else{
        newProduct = {
        name,
        category,
        unitPrice,
        stock
        };
      }
      sendNewProduct(newProduct);
      closeModal();
  }

  /** HTML code of the app that renders on http://localhost:8080 */
  return (
    <main>
      <div
        title="SearchBlock"
        className="mx-auto flex max-w-sm">
        <form className="max-w-sm mx-auto border rounded-lg mt-2" onSubmit={handleSearchSubmit}>
          <div className="mx-auto flex max-w-sm mt-5">
            <label htmlFor="name" className="ml-2">Name</label>
            <input type="text" id="name" name="name" className="flex border rounded-md mr-2 ml-auto" value={nameValue} onChange={handleNameChange}></input><br></br>
          </div>
          <div className="mx-auto flex max-w-sm mt-5">
            <label htmlFor="categories" className="ml-2">Category</label>
            <Select isMulti maxMenuHeight={150} options={categoryOptions} className="w-auto max-w-50 mr-2 ml-5" value={categoryValue} onChange={handleCategoryChange} placeholder="Select categories..."></Select><br></br>
          </div>
          <div className="mx-auto flex max-w-sm mt-5">
            <label htmlFor="availability" className="ml-2">Availability</label>
            <select id="availability" name="availability" className="flex border rounded-md h-8 w-45 mr-2 ml-auto" value={availabilityValue} onChange={handleAvailabilityChange}>
              <option value="All">All</option>  
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select><br></br>
          </div>
            <button type="submit" className=" mx-auto flex max-w-sm border rounded-sm mt-5 mb-3 w-15 text-center" ><label className="mr-auto ml-auto w-auto">Search</label></button>
        </form>
      </div>
      <div title="NewProductButton" className=" mx-auto flex max-w-md border rounded-sm mt-3 mb-3 w-30 text-center">
        <button 
          type="button"
          className="mr-auto ml-auto w-auto"
          onClick={openModal}>
            New Product
        </button>
      </div>
      {showModal && productModal()}
      {editingProductId && editProduct(editingProductId)}
      {deletingProductId && deleteProduct(deletingProductId)}
      <div title="ProudctTable">
          <table className="table auto border rounded-md mx-auto flex max-w-200 w-auto">
            <thead className="border rounded-md">
              <tr>
                <th scope="col" className="border w-5"><input type="checkbox" checked={checkedProducts.length === productList.length && productList.length > 0} onChange={handleSelectAllCheckbox}></input></th>
                <th scope="col" className="border w-30"><button onClick={() => getProducts(productCurrentPage,"category")}>Category&lt;&gt;</button></th>
                <th scope="col" className="border w-30"><button onClick={() => getProducts(productCurrentPage,"name")}>Name&lt;&gt;</button></th>
                <th scope="col" className="border w-20"><button onClick={() => getProducts(productCurrentPage,"unitPrice")}>Price&lt;&gt;</button></th>
                <th scope="col" className="border w-45"><button onClick={() => getProducts(productCurrentPage,"expirationDate")}>Expiration Date&lt;&gt;</button></th>
                <th scope="col" className="border w-20"><button onClick={() => getProducts(productCurrentPage,"stock")}>Stock&lt;&gt;</button></th>
                <th scope="col" className="border w-25">Actions&lt;&gt;</th>
              </tr>
            </thead>
            <tbody>
                {productRows}
            </tbody>
          </table>
        <div title="Pagination" className=" mx-auto flex max-w-md border rounded-sm mt-3 mb-3 w-10 text-center">
            {pagination()}
        </div>
      </div>
      <div title="CategoryMetrics">
        <table className="table auto border rounded-md mx-auto flex max-w-200 w-auto mt-2 ">
          <thead>
            <tr>
              <th scope="col" className="border w-30">Category</th>
              <th scope="col" className="border w-30">Total product in Stock</th>
              <th scope="col" className="border w-30">Total value in Stock</th>
              <th scope="col" className="border w-30">Average price in Stock</th>
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

