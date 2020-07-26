import React, { useState } from "react";
import "./main.css";
import axios from "axios";
import { Circular } from "styled-loaders-react";

export const Home = () => {
  const [searchValue, setSearchValue] = useState("");
  const [imageList, setImageList] = useState([]);
  const [moreImage, setMoreImage] = useState([]);
  const [showImageUrl, setShowImageUrl] = useState("");
  const [isMessage, setIsMessage] = useState(false);
  const [isPage, setIspage] = useState(false);
  const [loading, setLoading] = useState(false);

  let page = 1;
  let totalImage = 9;
  let client_id = "7ljfaI4raEc7jkwUvh6nujv0YOJ5LCtutcqI8HnUoAE";
  let url = `https://api.unsplash.com/search/photos?&per_page=${totalImage}`;

  function handleChange(e) {
    setShowImageUrl("");
    let searchText = e.target.value;
    setSearchValue(searchText);
  }

  function handleClick() {
    setLoading(true);
    setIsMessage(false);
    axios
      .get(`${url}&page=${page}&query=${searchValue}&client_id=${client_id}`)
      .then((response) => {
        if (response.data.results.length > 0) {
          setSearchValue("");
          setImageList(response.data.results);
          setTimeout(() => {
            setLoading(false);
          });
          CheckPages();
        } else {
          setIsMessage(true);
          setLoading(false);
        }
      })
      .catch((error) => console.log(error));
    setSearchValue("");
  }

  function CheckPages() {
    page++;
    axios
      .get(`${url}&page=${page}&query=${searchValue}&client_id=${client_id}`)
      .then((response) => {
        if (response.data.results.length > 0) {
          setIspage(true);
          setMoreImage(response.data.results);
        } else {
          setIspage(false);
        }
      });
  }

  function handleLoadMore() {
    setImageList(imageList.concat(moreImage));
    CheckPages();
  }

  function showImage(imgUrl) {
    setShowImageUrl(imgUrl);
  }

  return (
    <div>
      {showImageUrl ? (
        <div className='show-image'>
          <div className='container'>
            <h2 onClick={() => setShowImageUrl("")}>X</h2>
            <img src={showImageUrl} width='400px' height='350px' />
          </div>
        </div>
      ) : (
        ""
      )}

      <div className='search-bar'>
        <input
          type='text'
          onChange={handleChange}
          className='search-text'
          value={searchValue}
          placeholder='Search an Image here... '
        />
        <span className='search-button' type='submit' onClick={handleClick}>
          <i className='fa fa-search'></i>
        </span>
      </div>

      <div className='result-container'>
        {loading ? (
          <div className='loadingStyle'>
            {<Circular color='#172337' size='65px' />}
          </div>
        ) : isMessage ? (
          <div className='error-message'>Sorry something went wrong 😢</div>
        ) : (
          imageList.map((image, index) => (
            <div className='result-image' key={index}>
              <img
                className='main-img'
                src={image.urls.small}
                width='100%'
                height='100%'
                onClick={() => showImage(image.urls.regular)}
              />

              <div className='image-by'>
                <img src={image.user.profile_image.small} />
                <span>{image.user.username}</span>
              </div>
            </div>
          ))
        )}
      </div>
      {isPage ? (
        <div className='more-image' onClick={handleLoadMore}>
          Load More!
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
