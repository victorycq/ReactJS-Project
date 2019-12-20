import React, { Component } from 'react';
import { Parallax, Background } from 'react-parallax';
import {Fab, Button} from '@material-ui/core';
import {PlayArrowOutlined, Timeline, OutlinedFlagOutlined} from '@material-ui/icons';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { green, purple, } from '@material-ui/core/colors';

class Home extends Component {
    render() { 
        const styles = {
            fontFamily: "sans-serif",
            // textAlign: "center"
          };
        const description = {
            color: "white",
            position: "absolute",
            top:"30%",
            left: "5%",
            right:"5%",
        }
        const dataSource = {
            position: "absolute",
            left: "5%",
            right:"5%",
            textAlign:"center"
        }
        const image = require('../assets/img/parallax.png')

        const ColorButton = withStyles(theme => ({
            root: {
                borderColor: "rgb(17, 190, 190)",
                color:"white",
            //   color: theme.palette.getContrastText(purple[500]),
                top:"5%",
                left:"90%",
                right:"5%",
              '&:hover': {
                backgroundColor: "rgb(21, 245, 245, 0.3)",
                borderColor: "rgb(22, 250, 250)"
              },
            },
          }))(Button);
        return ( 
            <div style={styles}>

                <Parallax bgImage={image} blur={{ min: -1, max: 3 }}>
                    <div style={{ height: 500,backgroundColor: 'rgba(31, 26, 28, 0.7)' }}>
                    <ColorButton variant="outlined">
                        LOGIN
                    </ColorButton>
                    <div style={description}>
                        <h2>What is Lorem Ipsum?</h2>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                             Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                             when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                             It has survived not only five centuries, but also the leap into electronic typesetting, 
                             remaining essentially unchanged.</p>
                        <Fab variant="extended" style={{marginRight:30}}>
                            <PlayArrowOutlined />
                            Lihat Video
                        </Fab>
                        <Fab variant="extended">
                            <Timeline />
                            Mulai Prediksi
                        </Fab>
                    </div>
                </div>
                </Parallax>
                <h1 style= {{textAlign:"center"}}>| | |</h1>
                <div>
                    <div style={dataSource}>
                        <h2>DATA SOURCE</h2>
                        <p>Data yang digunakan dalam menciptakan model prediksi terhadap inflasi di Indonesia adalah <i>Inflasi,
                            Indeks Harga Konsumen (IHK), Produk Domestik Bruto (PDB), Kurs Dollar terhadap rupiah</i>, sedangkan range data
                            yang digunakan dalam menciptakan model prediksi berada pada tahun 2000 - 2017 dengan satuan waktu yang digunakan adalah bulan.</p>
                        <br />
                        <p>Sumber data yang digunakan dalam model prediksi berasal dari <b> Badan Pusat Statistik (BPS)</b>, <b>BPS</b> merupakan Lembaga 
                            Pemerintah Nonkementerian yang bertanggung jawab langsung kepada Presiden yang melaksanakan tugas pemerintahan dibidang 
                            statistik sesuai peraturan perundang-undangan. Detail tugas, fungsi, dan kewenangan <b>BPS</b> dapat dilihat <a href="https://www.bps.go.id/menu/1/sejarah.html#masterMenuTab4">disini</a></p>
                    </div>
                </div>
                
            </div>

         );
    }
}
 
export default Home;
