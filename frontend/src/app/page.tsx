export default function Home() {
  return (
    <main>
      <div 
        className="SearchBlock"
        style={{border: "1px solid black"}}>
        <form>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name"></input><br></br>
          <label htmlFor="categories">Category</label>
          <input type="text" id="categories" name="categories"></input><br></br>
          <label htmlFor="availability">Availability</label>
          <input type="text" id="availability" name="availability"></input>
          <input type="submit" value="Search"></input>
        </form>
      </div>
    </main>
  );
}
