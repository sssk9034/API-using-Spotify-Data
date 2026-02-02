const express = require('express');
const supa = require('@supabase/supabase-js');
const app = express();

const supaUrl = 'https://borlzwzajhcirlslybyw.supabase.co';
const supaAnonKey = 'sb_publishable_y4vcHyw_A4CeHchUqlymtg_6D-bMNKC';

const supabase = supa.createClient(supaUrl, supaAnonKey);


// 1. all artists
app.get('/API-Spotify-A1/artists', async (req, res) => {
    const {data, error} = await supabase
        .from('artists')
        .select(`artist_id, artist_name, types (type_name), artist_image_url, spotify_url, spotify_desc`)
        .order('artist_name', {ascending: true});

    if (error) {
        console.error(error);
        return;
    }
    
    res.send(data);
});

// 2. artist by id
app.get('/API-Spotify-A1/artists/:id', async (req, res) => {
    const {data, error} = await supabase
        .from('artists')
        .select(`artist_id, artist_name, types (type_name), artist_image_url, spotify_url, spotify_desc`)
        .eq('artist_id', req.params.id);

    if (error) {
        console.error(error);
        return;
    }

    res.send(data);
})

// 3. artist averages by id
/*app.get('/API-Spotify-A1/artists/averages/:id', async (req, res) => {
    const {data, error} = await supabase
        .from('artists')
        .select(`artist_id, artist_name, songs songs (bpm, energy, danceability, loudness, liveness, valence, duration, acousticness, speechiness, popularity)`)
        .eq('artist_id', req.params.id);

    if (error) {
        console.error(error);
        return;
    }

    const artist = data[0];
    if (!artist) {
        console.error(error);
        return;
    }

    const songFields = ['bpm','energy','danceability','loudness','liveness','valence','duration','acousticness','speechiness','popularity'];
    const averages = {};

    songFields.forEach(field => {
        const values = artist.songs.map(song[field]);
        const sum = values.reduce((acc, val) => acc + val, 0);
        averages['avg_' + field] = values.length ? +(sum / values.length).toFixed(2) : 0;
    });

    res.send({
        artist_id: artist.artist_id,
        artist_name: artist.artist_name,
        ...averages
    });
});*/

// 3. alternate 
app.get('/API-Spotify-A1/artists/averages/:id', async (req, res) => {
  const { data, error } = await supabase
    .rpc('getArtistAverages', { id: req.params.id });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data[0]);
});

function getArtistAverages(id) {

}

// 4. get all genres
app.get('/API-Spotify-A1/genres', async (req, res) => {
    const {data, error} = await supabase
        .from('genres')
        .select('*');
    
    if (error) {
        console.error(error);
        return;
    }

    res.send(data);
})

// 5. returns all songs sorted by title
app.get('/API-Spotify-A1/songs', async (req, res) => {
    const {data, error} = await supabase
        .from('songs')
        .select(`song_id, title, artists (artist_id, artist_name), genres (genre_id, genre_name), 
            year, bpm, energy, danceability, loudness, valence, duration, acousticness, speechiness, popularity`)
        .order('title', {ascending: true});

    if (error) {
        console.error(error);
        return;
    }

    res.send(data);
})

// 6. returns all the songs sorted by order field
app.get('/API-Spotify-A1/songs/sort/:order', async (req, res) => {
    const { data, error} = await supabase
        .rpc('getSongsByOrderField', {order : req.params.order});
})

// 7. returns specific song based on song_id
app.get('/API-Spotify-A1/songs/:id', async (req, res) => {
    const {data, error} = await supabase
        .from('songs')
        .select(`song_id, title, artists (artist_id, artist_name), genres (genre_id, genre_name), 
            year, bpm, energy, danceability, loudness, valence, duration, acousticness, speechiness, popularity`)
        .eq('song_id', req.params.id);

    if (error) {
        console.error(error);
        return;
    }

    res.send(data);
})

// 8. return song whose title begins with provided substring
app.get('/API-Spotify-A1/songs/search/begin/:substring', async (req, res) => {
    const {data, error} = await supabase
        .from('songs')
        .select(`song_id, title, artists (artist_id, artist_name), genres (genre_id, genre_name), 
            year, bpm, energy, danceability, loudness, valence, duration, acousticness, speechiness, popularity`)
        .ilike('title', `${req.params.substring}%`);

    if (error) {
        console.error(error);
        return;
    }

    res.send(data);
})

// 9. return songs whose title contains the provided substring
app.get('/API-Spotify-A1/songs/search/any/:substring', async (req, res) => {
    const {data, error} = await supabase
        .from('songs')
        .select(`song_id, title, artists (artist_id, artist_name), genres (genre_id, genre_name), 
            year, bpm, energy, danceability, loudness, valence, duration, acousticness, speechiness, popularity`)
        .ilike('title', `%${req.params.substring}%`);

    if (error) {
        console.error(error);
        return;
    }

    res.send(data);
})

// 10. returns songs whose year is equal to provided substring
app.get('/API-Spotify-A1/songs/search/year/:substring', async (req, res) => {
    const {data, error} = await supabase
        .from('songs')
        .select(`song_id, title, artists (artist_id, artist_name), genres (genre_id, genre_name), 
            year, bpm, energy, danceability, loudness, valence, duration, acousticness, speechiness, popularity`)
        .eq('year', req.params.substring);

    if (error) {
        console.error(error);
        return;
    }

    res.send(data);
})

// 11. returns all songs for specified artist
app.get('/API-Spotify-A1/songs/artist/:id', async (req, res) => {
    const {data, error} = await supabase
        .from('songs')
        .select(`song_id, title, artists (artist_id, artist_name), genres (genre_id, genre_name), 
            year, bpm, energy, danceability, loudness, valence, duration, acousticness, speechiness, popularity`)
        .eq('artist_id', req.params.id);

    if (error) {
        console.error(error);
        return;
    }

    res.send(data);
})

// 12. returns all songs for specified genre
app.get('/API-Spotify-A1/songs/genre/:id', async (req, res) => {
    const {data, error} = await supabase
        .from('songs')
        .select(`song_id, title, artists (artist_id, artist_name), genres (genre_id, genre_name), 
            year, bpm, energy, danceability, loudness, valence, duration, acousticness, speechiness, popularity`)
        .eq('genre_id', req.params.id);

    if (error) {
        console.error(error);
        return;
    }

    res.send(data);
})

// 13. returns all songs for specified playlist
app.get('/API-Spotify-A1/playlists/:id', async (req, res) => {
    const {data, error} = await supabase
        .from('playlists')
        .select(`playlist_id, songs (song_id, title, year, artists (artist_name), genres (genre_name))`)
        .eq('playlist_id', req.params.id);

    if (error) {
        console.error(error);
        return;
    }

    res.send(data);
})

// 14. returns top number (determined by parameter) of songs sorted by danceability in descending order
app.get('/API-Spotify-A1/mood/dancing/:num', async (req, res) => {
    let num = req.params.num;
    if (!num || num < 1 || num > 20) {
        num = 20;
    }

    const {data, error} = await supabase
        .from('songs')
        .select(`song_id, title, artists (artist_id, artist_name), genres (genre_id, genre_name), 
            year, bpm, energy, danceability, loudness, valence, duration, acousticness, speechiness, popularity`)
        .limit(num)
        .order('danceability', {ascending: false});

    if (error) {
        console.error(error);
        return;
    }

    res.send(data);
})

// 15. returns top number of songs sorted by valence in descending order
app.get('/API-Spotify-A1/mood/happy/:num', async (req, res) => {
    let num = req.params.num;
    if (!num || num < 1 || num > 20) {
        num = 20;
    }

    const {data, error} = await supabase
        .from('songs')
        .select(`song_id, title, artists (artist_id, artist_name), genres (genre_id, genre_name), 
            year, bpm, energy, danceability, loudness, valence, duration, acousticness, speechiness, popularity`)
        .limit(num)
        .order('valence', {ascending: false});

    if (error) {
        console.error(error);
        return;
    }

    res.send(data);
})

// 16. returns top number of songs sorted by liveliness divided by acousticness in descending order
app.get('/API-Spotify-A1/mood/coffee/:num', async (req, res) => {
    let num = req.params.num;
    if (!num || num < 1 || num > 20) {
        num = 20;
    }

    const {data, error} = await supabase
        .from('tableWithMath')
        .select(`song_id, title, artists (artist_id, artist_name), genres (genre_id, genre_name), 
            year, bpm, energy, danceability, loudness, valence, duration, acousticness, speechiness, popularity`)
        .limit(num)
        .order('coffeeCalc', {ascending: false});

    if (error) {
        console.error(error);
        return;
    }

    res.send(data);
})

app.listen(8080, () => {
    console.log('listening on port 8080');
    console.log('http://localhost:8080/API-Spotify-A1/artists');
    console.log('http://localhost:8080/API-Spotify-A1/artists/129');
    console.log('http://localhost:8080/API-Spotify-A1/artists/sdfjkhsdf');
    console.log('http://localhost:8080/API-Spotify-A1/artists/averages/129');
    console.log('http://localhost:8080/API-Spotify-A1/genres');
    console.log('http://localhost:8080/API-Spotify-A1/songs');
    console.log('http://localhost:8080/API-Spotify-A1/songs/artist');
    console.log('http://localhost:8080/API-Spotify-A1/songs/year');
    console.log('http://localhost:8080/API-Spotify-A1/duration');
    console.log('http://localhost:8080/API-Spotify-A1/songs/1010');
    console.log('http://localhost:8080/API-Spotify-A1/songs/sjdkfhsdkjf');
    console.log('http://localhost:8080/API-Spotify-A1/songs/search/begin/love');
    console.log('http://localhost:8080/API-Spotify-A1/songs/search/begin/sdjfhs');
    console.log('http://localhost:8080/API-Spotify-A1/songs/search/any/love');
    console.log('http://localhost:8080/API-Spotify-A1/songs/search/year/2017');
    console.log('http://localhost:8080/API-Spotify-A1/songs/search/year/2027');
    console.log('http://localhost:8080/API-Spotify-A1/songs/artist/149');
    console.log('http://localhost:8080/API-Spotify-A1/songs/artist/7834562');
    console.log('http://localhost:8080/API-Spotify-A1/songs/genre/115');
    console.log('http://localhost:8080/API-Spotify-A1/playlists');
    console.log('http://localhost:8080/API-Spotify-A1/playlists/3');
    console.log('http://localhost:8080/API-Spotify-A1/playlists/35362');
    console.log('http://localhost:8080/API-Spotify-A1/mood/dancing/5');
    console.log('http://localhost:8080/API-Spotify-A1/mood/dancing/500');
    console.log('http://localhost:8080/API-Spotify-A1/mood/dancing/5ksdjf');
    console.log('http://localhost:8080/API-Spotify-A1/mood/happy/8');
    console.log('http://localhost:8080/API-Spotify-A1/mood/happy');
    console.log('http://localhost:8080/API-Spotify-A1/mood/coffee/10');
});