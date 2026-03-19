import "./navbar.css";

export function Navbar({ title, price, image, stock, id }) {
  return (
    <>
      <p>IT</p>
      <input type="text" placeholder="search" />
      <select>
        <option value="price :heigt->low">price :heigt-low</option>
        <option value="price : low->height ">price : low-height </option>
        <option value="sortby price">sortby price</option>
      </select>
      <button>cart</button>
    </>
  );
}
