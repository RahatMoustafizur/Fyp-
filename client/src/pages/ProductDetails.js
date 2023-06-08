import React, { useState, useEffect, useContext } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetailsStyles.css";
import { DeliveryContext } from "../context/DeliveryProvider";
import { useCart } from "../context/cart";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { deliveryOption, setDeliveryOption } = useContext(DeliveryContext); // Default delivery option is set to "7 days"
  const [cart, setCart] = useCart();
  console.log(deliveryOption)
  // Inital details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  // Get product
  const getProduct = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  // Get similar products
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(`/api/v1/product/related-product/${pid}/${cid}`);
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Add product to cart
  const addToCart = (product) => {
    setCart([...cart, product]);
    localStorage.setItem("cart", JSON.stringify([...cart, product]));
    alert("Item added to cart");
  };

  return (
    <Layout>
      <div className="row container product-details">
        <div className="col-md-6">
          <img
            src={`/api/v1/product/product-photo/${product._id}`}
            className="card-img-top"
            alt={product.name}
            height="300"
            width={"350px"}
          />
        </div>
        <div className="col-md-6 product-details-info">
          <h1 className="text-center">Product Details</h1>
          <hr />
          <h6>Name: {product.name}</h6>
          <h6>Description: {product.description}</h6>
          <h6>
            Price:{" "}
            {product?.price?.toLocaleString("en-MY", {
              style: "currency",
              currency: "MYR",
            })}
          </h6>
          <h6>Category: {product?.category?.name}</h6>
          <h6>Color: {product?.color}</h6> {/* Add color field */}
          <h6>Size: {product?.size}</h6> {/* Add size field */}
          <div className="delivery-option">
            <h6>Delivery Time within:</h6>
            <select
              value={deliveryOption}
              onChange={(e) => setDeliveryOption(e.target.value)}
            >
              <option value="7 days1">7 days</option>
              <option value="10 days">10 days</option>
              <option value="15 days">15 days</option>
              <option value="20 days">20 days</option>
              <option value="30 days">30 days</option>

              {/* Add more delivery options if needed */}
            </select>
          </div>
          <button
            className="btn btn-secondary ms-1"
            onClick={() => addToCart(product)}
          >
            ADD TO CART
          </button>
        </div>
      </div>
      <hr />
      <div className="row container similar-products">
        <h4>Similar Products ➡️</h4>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <div className="card m-2" key={p._id}>
              <img
                src={`/api/v1/product/product-photo/${p._id}`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <div className="card-name-price">
                  <h5 className="card-title">{p.name}</h5>
                  <h5 className="card-title card-price">
                    {p.price.toLocaleString("en-MY", {
                      style: "currency",
                      currency: "MYR",
                    })}
                  </h5>
                </div>
                <p className="card-text ">{p.description.substring(0, 60)}...</p>
                <div className="card-name-price">
                  <button
                    className="btn btn-info ms-1"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                  <button className="btn btn-dark ms-1" onClick={() => addToCart(p)}>
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
