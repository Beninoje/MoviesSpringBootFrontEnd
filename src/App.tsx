import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ViewMovie from './pages/ViewMovie'
import Header from './components/header/header'
import WishLists from './pages/WishLists'
import SearchPage from './pages/SearchPage'

function App() {

  return (
    <BrowserRouter>
      <Header/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/:movieId" element={<ViewMovie/>}/>
          <Route path="/wish-list" element={<WishLists/>}/>
          <Route path="/find" element={<SearchPage/>}/>
          {/* <Route element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
            <Route path='/create-listing' element={<CreateListing />} />
            <Route
              path='/update-listing/:listingId'
              element={<UpdateListing />}
            />
  
          </Route> */}
        </Routes>
    
    </BrowserRouter>
  )
}

export default App
