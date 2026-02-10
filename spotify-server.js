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
        res.send(error);
        return;
    } 
    
    res.send(data);
});

// 2. artist by id
app.get('/API-Spotify-A1/artists/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        res.json({error: "No results found", message: `(${req.params.id}) is not a number.`});
        return;
    }

    const {data, error} = await supabase
        .from('artists')
        .select(`artist_id, artist_name, types (type_name), artist_image_url, spotify_url, spotify_desc`)
        .eq('artist_id', id);

    if (error) {
        res.send(error);
        return;
    } else if (data.length == 0) {
        res.json({error: "No results found", message: `There are no artists with id: (${req.params.id})`});
        return;
    }

    res.send(data);
})

// 3. artist averages by id
app.get('/API-Spotify-A1/artists/averages/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        res.json({error: "No results found", message: `(${req.params.id}) is not a number.`});
        return;
    }

    // I did A LOT of searching and trial and error to get the rpc function to work...
    const { data, error } = await supabase
        .rpc('get_artist_averages', { id: req.params.id });

    if (error) {
        res.send(error);
        return;
    }

    res.send(data);
});

// 3. handling missing parameter
app.get('/API-Spotify-A1/artists/averages', async (req, res) => {
    res.json({error: "No results found", message: `No artist id was provided.`});
        return;
})

// 4. get all genres
app.get('/API-Spotify-A1/genres', async (req, res) => {
    const {data, error} = await supabase
        .from('genres')
        .select('*');
    
    if (error) {
        res.send(error);
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
        res.send(error);
        return;
    }

    res.send(data);
})

// 6. returns all the songs sorted by order field
app.get('/API-Spotify-A1/songs/sort/:order', async (req, res) => {
    const { data, error} = await supabase
        .rpc('get_songs_sorted_by_order_field', {order_text : req.params.order});

    if (error) {
        res.send(error);
        return;
    }

    res.send(data);
})

// 6. handling missing parameter
app.get('/API-Spotify-A1/songs/sort', async (req, res) => {
    res.json({error: "No results found", message: `No order field was provided.`});
        return;
})

// 7. returns specific song based on song_id
app.get('/API-Spotify-A1/songs/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        res.json({error: "No results found", message: `(${req.params.id}) is not a number.`});
        return;
    }

    const {data, error} = await supabase
        .from('songs')
        .select(`song_id, title, artists (artist_id, artist_name), genres (genre_id, genre_name), 
            year, bpm, energy, danceability, loudness, valence, duration, acousticness, speechiness, popularity`)
        .eq('song_id', id);

    if (error) {
        res.send(error);
        return;
    } else if (data.length == 0) {
        res.json({error: "No results found", message: `There are no songs with id: (${req.params.id})`});
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
        res.send(error);
        return;
    } else if (data.length == 0) {
        res.json({error: "No results found", message: `There are no songs beginning with (${req.params.substring})`});
        return;
    }

    res.send(data);
})

// 8. handling missing parameter
app.get('/API-Spotify-A1/songs/search/begin', async (req, res) => {
    res.json({error: "No results found", message: `No string was provided.`});
        return;
})

// 9. return songs whose title contains the provided substring
app.get('/API-Spotify-A1/songs/search/any/:substring', async (req, res) => {
    const {data, error} = await supabase
        .from('songs')
        .select(`song_id, title, artists (artist_id, artist_name), genres (genre_id, genre_name), 
            year, bpm, energy, danceability, loudness, valence, duration, acousticness, speechiness, popularity`)
        .ilike('title', `%${req.params.substring}%`);

    if (error) {
        res.send(error);
        return;
    } else if (data.length == 0) {
        res.json({error: "No results found", message: `There are no songs with (${req.params.substring}) in the title`});
        return;
    }

    res.send(data);
})

// 9. handling missing parameter
app.get('/API-Spotify-A1/songs/search/any', async (req, res) => {
    res.json({error: "No results found", message: `No string was provided.`});
        return;
})

// 10. returns songs whose year is equal to provided substring
app.get('/API-Spotify-A1/songs/search/year/:substring', async (req, res) => {
    const year = Number(req.params.substring);

    if (!Number.isInteger(year)) {
        res.json({error: "No results found", message: `(${req.params.substring}) is not a number.`});
        return;
    }

    const {data, error} = await supabase
        .from('songs')
        .select(`song_id, title, artists (artist_id, artist_name), genres (genre_id, genre_name), 
            year, bpm, energy, danceability, loudness, valence, duration, acousticness, speechiness, popularity`)
        .eq('year', req.params.substring);

    if (error) {
        res.send(error);
        return;
    } else if (data.length == 0) {
        res.json({error: "No results found", message: `There are no songs from the year (${req.params.substring})`});
        return;
    }

    res.send(data);
})

// 10. handling missing parameter
app.get('/API-Spotify-A1/songs/search/year', async (req, res) => {
    res.json({error: "No results found", message: `No string was provided.`});
        return;
})

// 11. returns all songs for specified artist
app.get('/API-Spotify-A1/songs/artist/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        res.json({error: "No results found", message: `(${req.params.id}) is not a number.`});
        return;
    }

    const {data, error} = await supabase
        .from('songs')
        .select(`song_id, title, artists (artist_id, artist_name), genres (genre_id, genre_name), 
            year, bpm, energy, danceability, loudness, valence, duration, acousticness, speechiness, popularity`)
        .eq('artist_id', req.params.id);

    if (error) {
        res.send(error);
        return;
    } else if (data.length == 0) {
        res.json({error: "No results found", message: `There are no songs by the artist with id: (${req.params.id})`});
        return;
    }

    res.send(data);
})

// 11. handling missing parameter
app.get('/API-Spotify-A1/songs/artist', async (req, res) => {
    res.json({error: "No results found", message: `No artist id was provided.`});
        return;
})

// 12. returns all songs for specified genre
app.get('/API-Spotify-A1/songs/genre/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        res.json({error: "No results found", message: `(${req.params.id}) is not a number.`});
        return;
    }

    const {data, error} = await supabase
        .from('songs')
        .select(`song_id, title, artists (artist_id, artist_name), genres (genre_id, genre_name), 
            year, bpm, energy, danceability, loudness, valence, duration, acousticness, speechiness, popularity`)
        .eq('genre_id', req.params.id);

    if (error) {
        res.send(error);
        return;
    } else if (data.length == 0) {
        res.json({error: "No results found", message: `There are no songs in the genre with id: (${req.params.id})`});
        return;
    }

    res.send(data);
})

// 12. handling missing parameter
app.get('/API-Spotify-A1/songs/genre', async (req, res) => {
    res.json({error: "No results found", message: `No genre id was provided.`});
        return;
})

// 13. returns all songs for specified playlist
app.get('/API-Spotify-A1/playlists/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        res.json({error: "No results found", message: `(${req.params.id}) is not a number.`});
        return;
    } 

    const {data, error} = await supabase
        .from('playlists')
        .select(`playlist_id, songs (song_id, title, year, artists (artist_name), genres (genre_name))`)
        .eq('playlist_id', req.params.id);

    if (error) {
        res.send(error);
        return;
    } else if (data.length == 0) {
        res.json({error: "No results found", message: `There are no playlists with the id: (${req.params.id})`});
        return;
    }

    res.send(data);
})

// 13. handling missing parameter
app.get('/API-Spotify-A1/playlists', async (req, res) => {
    res.json({error: "No results found", message: `No playlist id was provided.`});
        return;
})

// 14. returns top number (determined by parameter) of songs sorted by danceability in descending order
app.get('/API-Spotify-A1/mood/dancing/:num', async (req, res) => {
    let num = Number(req.params.num);

    if (!Number.isInteger(num)) {
        res.json({error: "No results found", message: `(${req.params.num}) is not a number.`});
        return;
    } else if (!num || num < 1 || num > 20) {
        num = 20;
    }

    const {data, error} = await supabase
        .from('songs')
        .select(`song_id, title, artists (artist_id, artist_name), genres (genre_id, genre_name), 
            year, bpm, energy, danceability, loudness, valence, duration, acousticness, speechiness, popularity`)
        .limit(num)
        .order('danceability', {ascending: false});

    if (error) {
        res.send(error);
        return;
    }

    res.send(data);
})

// 14. handling missing parameter
app.get('/API-Spotify-A1/mood/dancing', async (req, res) => {
    const num = 20;

    const {data, error} = await supabase
        .from('songs')
        .select(`song_id, title, artists (artist_id, artist_name), genres (genre_id, genre_name), 
            year, bpm, energy, danceability, loudness, valence, duration, acousticness, speechiness, popularity`)
        .limit(num)
        .order('danceability', {ascending: false});

    if (error) {
        res.send(error);
        return;
    }

    res.send(data);
})

// 15. returns top number of songs sorted by valence in descending order
app.get('/API-Spotify-A1/mood/happy/:num', async (req, res) => {
    let num = Number(req.params.num);

    if (!Number.isInteger(num)) {
        res.json({error: "No results found", message: `(${req.params.num}) is not a number.`});
        return;
    } else if (!num || num < 1 || num > 20) {
        num = 20;
    }

    const {data, error} = await supabase
        .from('songs')
        .select(`song_id, title, artists (artist_id, artist_name), genres (genre_id, genre_name), 
            year, bpm, energy, danceability, loudness, valence, duration, acousticness, speechiness, popularity`)
        .limit(num)
        .order('valence', {ascending: false});

    if (error) {
        res.send(error);
        return;
    }

    res.send(data);
})

// 15. handling missing parameter
app.get('/API-Spotify-A1/mood/happy', async (req, res) => {
    const num = 20;

    const {data, error} = await supabase
        .from('songs')
        .select(`song_id, title, artists (artist_id, artist_name), genres (genre_id, genre_name), 
            year, bpm, energy, danceability, loudness, valence, duration, acousticness, speechiness, popularity`)
        .limit(num)
        .order('valence', {ascending: false});

    if (error) {
        res.send(error);
        return;
    }

    res.send(data);
})

// 16. returns top number of songs sorted by liveliness divided by acousticness in descending order
app.get('/API-Spotify-A1/mood/coffee/:num', async (req, res) => {
    let num = Number(req.params.num);

    if (!Number.isInteger(num)) {
        res.json({error: "No results found", message: `(${req.params.num}) is not a number.`});
        return;
    } else if (!num || num < 1 || num > 20) {
        num = 20;
    }

    // I changed the values of acousticness (if they were zero) from 0 to 1 so the calculation didn't throw an error 
    const {data, error} = await supabase
        .rpc('coffee_calc', {num : num});

    if (error) {
        res.send(error);
        return;
    }

    res.send(data);
})

// 16. handling missing parameter
app.get('/API-Spotify-A1/mood/coffee', async (req, res) => {
    const num = 20;

    const {data, error} = await supabase
        .rpc('coffee_calc', {num : num});

    if (error) {
        res.send(error);
        return;
    }

    res.send(data);
})

// 17. return top number of songs sorted by product of the energy and speechiness parameters in ascending order
app.get('/API-Spotify-A1/mood/studying/:num', async (req, res) => {
    let num = Number(req.params.num);

    if (!Number.isInteger(num)) {
        res.json({error: "No results found", message: `(${req.params.num}) is not a number.`});
        return;
    } else if (!num || num < 1 || num > 20) {
        num = 20;
    }

    const {data, error} = await supabase
        .rpc('study_calc', {num : num});

    if (error) {
        res.send(error);
        return;
    }

    res.send(data);
})

// 17. handling missing parameter
app.get('/API-Spotify-A1/mood/studying', async (req, res) => {
    const num = 20;

    const {data, error} = await supabase
        .rpc('study_calc', {num : num});

    if (error) {
        res.send(error);
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
    console.log('http://localhost:8080/API-Spotify-A1/songs/sort/artist');
    console.log('http://localhost:8080/API-Spotify-A1/songs/sort/year');
    console.log('http://localhost:8080/API-Spotify-A1/songs/sort/duration');
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
    console.log('http://localhost:8080/API-Spotify-A1/mood/dancing/ksdjf');
    console.log('http://localhost:8080/API-Spotify-A1/mood/happy/8');
    console.log('http://localhost:8080/API-Spotify-A1/mood/happy');
    console.log('http://localhost:8080/API-Spotify-A1/mood/coffee/10');
    console.log('http://localhost:8080/API-Spotify-A1/mood/studying/15');
});