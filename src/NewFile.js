import React from 'react';
import { Button, Container, Row, Col } from 'reactstrap';
import axios from 'axios';

import movieImg from '../src/Img/MovieTime.jfif'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';


class App extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         data: '',
         columnDefs: [
            { headerName: 'Name', field: 'name' },
            { headerName: 'Rating', field: 'rating' },
            { headerName: 'Rank', field: 'rank' },
            { headerName: 'Year', field: 'year' },
            { headerName: 'Cast&Crew', field: 'crew' },
            { headerName: 'Link', field: 'link' }
         ],
         rowData: [],
         isEmpty: false,
         isBadRequest: false
      }
      this.updateState = this.updateState.bind(this);
   };
   updateState(e) {
      this.setState({ data: e.target.value });
   }

   async OnSearch(a) {
      //if(a.includes("crew")) {alert(a.substring(4,a.length))}
      //console.log(a)
      if (a !== null && a !== '') {
         try {
            await axios.get('http://192.168.225.226:8080/GetMovie', {
               params: {
                  name: a.includes("name") ? a.substring(5, a.length) : null,
                  crew: a.includes("crew") ? a.substring(5, a.length) : null,
                  rank: a.includes("rank") ? a.substring(5, a.length) : null,
                  year: a.includes("year") ? a.substring(5, a.length) : null,
                  rating: a.includes("rating") ? a.substring(7, a.length) : null
               }
            })
               .then(res => {
                  //console.log(res.status)
                  //console.log(res.data)
                  if (res.status === 200 && res.data.length > 0) {
                     this.setState({ rowData: res.data, isEmpty: false });
                  } else if (res.status === 200 && res.data.length === 0) {
                     this.setState({isEmpty: true });
                  }
               })
         }
         catch (error) {
            console.error(error);
            this.setState({ isBadRequest: true });
            window.location.reload();
         }
      }
      else { alert("Search movies using prefixed keywords like name, year, rating, rank and crew (Eg: rating 8)") }
   }

   render() {
      return (
         <Container>
            <div style={{ marginLeft: '400px', marginTop: '10px' }}>
               <img src={movieImg} alt="this is car image" />
            </div>
            <div style={{ marginLeft: '400px', marginTop: '30px' }}>
               <input placeholder="search movie..." type="text" value={this.state.data}
                  onChange={this.updateState} />
               <Button style={{ marginLeft: '20px' }} color="primary" onClick={() => this.OnSearch(this.state.data)}>Movie Search</Button>
            </div>
            {this.state.isBadRequest === true ?
               <p style={{ marginLeft: '400px', marginTop: '10px' }}>Bad Request.</p>
               : this.state.rowData.length > 0 ?
                  <Row>
                     <Col sm="12" md={{ size: 5, offset: 0 }}>
                        <div style={{ marginLeft: '4px' }}>
                           <br />
                           <div className="ag-theme-balham"
                              style={{ height: '500px', width: '1110px' }}>
                              <AgGridReact
                                 columnDefs={this.state.columnDefs}
                                 rowData={this.state.rowData}>
                              </AgGridReact>
                           </div>
                        </div>
                     </Col>
                  </Row>
                  : this.state.isEmpty === true ?
                     <p style={{ marginLeft: '400px', marginTop: '10px' }}>About 0 search results</p>
                     : null}
         </Container >
      );
   }
}
export default App;