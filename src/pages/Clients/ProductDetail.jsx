import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Helmet from "../../components/layout/Helmet";
import CommonSection from "../../components/UI/CommonSection";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { motion } from "framer-motion";
import ProductList from "../../components/UI/ProductList";
import { useEffect } from "react";
import { addToCart } from "../../slices/cartSlice";
import { toast } from "react-toastify";
const Wrapper = styled.section`
  .container{
    padding: 0px 140px;
  }
  .row {
    display: flex;
  }
  .col{
    padding: 50px 50px;
  }
  .col img {
    width: 350px;
    height: auto;
    border-radius: 5px;
  }
  .product__details {
    margin-top: 50px;
  }
  .product__details h2 {
    font-size: 1.6rem;
    margin-bottom: 10px;
  }
  .product__rating{
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 3px;
  }
  .product__rating span i{
    color: coral;
  }
  .product__rating p span{
    color: coral;
  }
  .product__price{
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .product__price .price{
    color: #929292;
    text-decoration: line-through;
  }
  .product__price .price__end{
    font-size: 1.5rem;
    font-weight: 500;
    color: #e13737;
  }
  .buy__btn{
    border: none;
    outline: none;
    padding: 10px 20px;
    margin: 20px 7px;
    border-radius: 5px;
    background: #0D324D;
    color: #dfdede;
    cursor: pointer;
    font-size: .9rem;
  }
  .buy__btn:hover{
    color: #fff;
  }
  .more__info{
    padding: 15px 0px;
  }
  .more__info p {
    padding: 5px 0px;
  }
  .tab__wrapper {
    display: flex;
    gap: 5rem;
  }
  .tab__wrapper h6{
    color: #0D324D;
    font-weight: 500;
    font-size: 1rem;
    cursor: pointer;
  }
  .active__tab{
    color: #e13737 !important;
    border-bottom: 1px solid #e13737;
  }
  .tab__content p{
    line-height: 30px;
  }
  .reviews__wrapper ul li {
    margin: 20px 0px;
  }
  .reviews__wrapper ul li h6{
    color: #0D324D;
    font-weight: 600;
    font-size: 1rem;
    padding: 5px 0px;
  }
  .reviews__wrapper ul li span{
    color: coral;
    font-weight: 600;
  }
  .reviews__wrapper ul li p{
    margin-top: 10px;
    color: #999;
  }
  .review__form {
    width: 70%;
    margin-top: auto;
    margin-top: 50px;
  }
  .review__form h4 {
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 30px;
  }
  .form__group input, 
  .form__group textarea{
    width: 100%;
    border: 1px solid #0D324D;
    border-radius: 5px;
    padding: 8px 20px;
    resize: none;
  }
  .form__group input:focus, 
  .form__group textarea:focus{
    outline: none;
  }
  .form__group{
    margin-bottom: 30px;
  }
  .form__group span,
  .form__group span i{
    display: flex;
    align-items: center;
    column-gap: 5px;
    color: coral;
    cursor: pointer;
  }
  .related__title {
    font-size: 1.7rem;
    font-weight: 600;
    text-align: center;
    color: #0D324D;
  }
  .variant__btn{
    cursor: pointer;
    width: 100px;
    padding: 10px 0px;
    margin: 30px 20px 30px 0px;
    border-radius: 2px;
    background: none;
    border: 1px solid rgba(0, 0, 0, 0.3 );
    outline: none;
    color: #0D324D;
  }
  .active{
    color: coral;
    background: #fbf8f6;
    border: 1px solid coral;
  }
`

const ProductDetail = () => {
  const { slug } = useParams()
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState('desc')
  const [active, setActive] = useState(null);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { products, loading } = useSelector((state) => state.product)
  const productSelect = products.find(item => item.slug === slug)

  const [product, setProduct] = useState({
    _id: 0,
    name: "",
    price: 0,
    discountPercent: 0,
    description: "",
    productPictures: [],
    category: [],
    reviews: [],
    variants: [],
  });

  const [cartItem, setCartItem] = useState({
    product: "",
    variant: "",
    quantity: 1
  });

  const handleSelectedVariant = (value, index) => {
    setActive(index);
    setCartItem({ ...cartItem, product:  productSelect._id, variant: value, quantity: 1 });
  };

  const handleAddCart = async () => {
    if (!cartItem.variant) {
      toast.error("Vui lòng chọn phân loại hàng");
    } else if (cartItem.quantity === 0) {
      toast.error("Vui lòng chọn lại số lượng");
    } else if (!isAuthenticated) {
      navigate("/signin");
    } else {
      try{
        const res = await dispatch(addToCart({ cartItem: cartItem }));
        toast.success("added to cart")
      }
      catch (error) {
        toast.error("Đã có lỗi xảy ra vui lòng thử lại");
        console.log(error);
        return;
      }
    }
  };

  let rating = 0
  product.reviews.forEach(item => {
    rating += item.rating
  });
  rating = Number(rating / product.reviews.length).toFixed(2)

  const relatedProducts = products.filter((item) => item.category.name === product.category.name).slice(0, 8)

  useEffect(() => {
    if (productSelect) {
      setProduct({
        ...product,
        _id: productSelect.id,
        name: productSelect.name,
        price: productSelect.price,
        discountPercent: productSelect.discountPercent,
        description: productSelect.description,
        productPictures: productSelect.productPictures,
        category: productSelect.category,
        reviews: productSelect.reviews,
        variants: productSelect.variants,
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [productSelect])

  return (
    <Helmet title={product.name}>
      <CommonSection title={product.name} />
      <Wrapper>
        <div className="container">
          <div className="row">
            <div className="col">
              <img src={product.productPictures[0]} alt='' />
            </div>

            <div className="col">
              <div className="product__details">
                <h2>{product.name}</h2>
                <div className="product__rating">
                  <div className="product__price">
                    <span><i className="ri-star-s-fill"></i></span>
                    <span><i className="ri-star-s-fill"></i></span>
                    <span><i className="ri-star-s-fill"></i></span>
                    <span><i className="ri-star-s-fill"></i></span>
                    <span><i className="ri-star-s-fill"></i></span>
                  </div>
                  <p>
                    (<span>{rating}</span> ratings)</p>
                </div>
                <div className="product__price">
                  <span className="price">{Number(product.price).toLocaleString("vi")}₫</span>
                  <span className="price__end">{Number(Math.ceil((product.price * (100 - product.discountPercent)) / 100)).toLocaleString("vi")}₫</span>
                </div>
                <div className="more__info">
                  <p>Phân loại: {product.category.name}</p>
                    <p>Kiểu dáng:</p>
                  <div>
                    {
                      product.variants?.map((item, index) => (
                        <input key={index}
                          className={active === index ? ("variant__btn active"):("variant__btn")}
                          type="button"
                          value={item.name}
                          required
                          disabled={item.quantity === 0 ? true : false}
                          onClick={() => handleSelectedVariant(item._id, index)}
                        />
                      ))
                    }
                  </div>
                  <p style={{ color: "#999" }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur iure quas illo voluptates labore tempore!</p>
                </div>

                <motion.button onClick={handleAddCart} whileHover={{ scale: 1.2 }} className="buy__btn">Add to Cart</motion.button>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>

      <Wrapper>
        <div className="container">
          <div className="row" style={{ alignItems: "center", justifyContent: "center" }}>
            <div className="tab__wrapper">
              <h6 className={`${tab === 'desc' ? 'active__tab' : ''}`}
                onClick={() => setTab('desc')}>Description</h6>
              <h6 className={`${tab === 'rev' ? 'active__tab' : ''}`}
                onClick={() => setTab('rev')}>Reviews({product.reviews.length})</h6>
            </div>
          </div>
          <div className="row" style={{ marginTop: '2rem', border: '1px solid #0D324D', borderRadius: '5px', padding: '10px 10px' }}>
            <div>
              {
                tab === 'desc' ?
                  <div className="tab__content">
                    <p style={{ color: "#999" }}>{product.description}</p>
                  </div> :
                  <div className="product__reviews">
                    <div className="reviews__wrapper">
                      {
                        product.reviews.length === 0 ?
                          <div>No reviews</div> :
                          <ul>
                            {
                              product.reviews.map((item, index) => (
                                <li key={index}>
                                  <h6>{item.user.name}</h6>
                                  <span>{item.rating}(rating)</span>
                                  <p>{item.comment}</p>
                                </li>
                              ))
                            }
                          </ul>
                      }
                    </div>
                  </div>
              }
            </div>
          </div>

          {
            tab === 'rev' ?
              <div className="row" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="review__form">
                  <h4>Leave you experience</h4>
                  <form>
                    <div className="form__group">
                      <input type="text" placeholder="Enter name" />
                    </div>
                    <div className="form__group" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <span>1<i className="ri-star-s-fill"></i></span>
                      <span>2<i className="ri-star-s-fill"></i></span>
                      <span>3<i className="ri-star-s-fill"></i></span>
                      <span>4<i className="ri-star-s-fill"></i></span>
                      <span>5<i className="ri-star-s-fill"></i></span>
                    </div>
                    <div className="form__group">
                      <textarea rows="4" type="text" placeholder="Review Message ..." />
                    </div>

                    <button type="submit" className="buy__btn">Submit</button>
                  </form>
                </div>
              </div> : <></>
          }
        </div>
      </Wrapper>

      <Wrapper>
        <h2 className="related__title">You might also like</h2>
        <ProductList data={relatedProducts} />
      </Wrapper>
    </Helmet>
  );
}

export default ProductDetail;
