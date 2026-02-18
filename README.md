# API Using Spotify Data

## Overview
This assignment focuses on building a Node.js API backed by a cloud-based database using Supabase. The dataset contains Spotify information on songs, artists, genres, and artist types from hit songs released between 2016–2019.

Supabase is used to provide practical experience with a cloud DBMS and to simplify future integration with a React frontend. Since the project uses Node.js, it is deployed on a server-capable hosting platform. This application is hosted on Vercel, where free-tier deployments may experience a short delay on the first request after inactivity.

## API Endpoints

| Endpoint | Description | Status |
|--------|-------------|--------|
| `/api/artists` | Returns all artists sorted by `artist_name`. Includes `types (type_name)` instead of artist_type foreign keys. | ✅ |
| `/api/artists/:id` | Returns a specific artist using `artist_id` (e.g., `/api/artists/129`). | ✅ |
| `/api/artists/averages/:id` | Returns average values for bpm, energy, danceability, loudness, liveness, valence, duration, acousticness, speechiness, and popularity for a specific artist. | ✅ |
| `/api/genres` | Returns all genres. | ✅ |
| `/api/songs` | Returns all songs sorted by title. Includes artist (`artist_id`, `artist_name`) and genre (`genre_id`, `genre_name`) instead of foreign keys. | ✅ |
| `/api/songs/sort/:order` | Returns songs sorted by the specified field: `id`, `title`, `artist`, `genre`, `year`, or `duration`. | ✅ |
| `/api/songs/:id` | Returns a specific song using `song_id` (e.g., `/api/songs/1028`). | ✅ |
| `/api/songs/search/begin/:substring` | Returns songs whose titles begin with the provided substring (case-insensitive). | ✅ |
| `/api/songs/search/any/:substring` | Returns songs whose titles contain the provided substring (case-insensitive). | ✅ |
| `/api/songs/search/year/:year` | Returns songs released in the specified year (e.g., `2017`). | ✅ |
| `/api/songs/artist/:id` | Returns all songs for the specified artist. | ✅ |
| `/api/songs/genre/:id` | Returns all songs for the specified genre. | ✅ |
| `/api/playlists/:id` | Returns all songs for a specified playlist. Includes playlist, song_id, title, artist name, genre name, and year. | ✅ |
| `/api/mood/dancing/:n` | Returns top `n` songs sorted by danceability (desc). Defaults to 20 if `n` is invalid. | ✅ |
| `/api/mood/happy/:n` | Returns top `n` songs sorted by valence (desc). Defaults to 20 if `n` is invalid. | ✅ |
| `/api/mood/coffee/:n` | Returns top `n` songs sorted by liveness ÷ acousticness (desc). Defaults to 20 if `n` is invalid. | ✅ |
| `/api/mood/studying/:n` | Returns top `n` songs sorted by energy × speechiness (asc). Defaults to 20 if `n` is invalid. | ✅ |
###### I took the checking system idea from Matthew with permission



## API Examples
- [/api/artists](https://api-using-spotify-data.vercel.app/API-Spotify-A1/artists)
- [/api/artists/129](https://api-using-spotify-data.vercel.app/API-Spotify-A1/artists/129)
- [/api/artists/sdfjkhsdf](https://api-using-spotify-data.vercel.app/API-Spotify-A1/artists/sdfjkhsdf)
- [/api/artists/averages/129](https://api-using-spotify-data.vercel.app/API-Spotify-A1/artists/averages/129)
- [/api/genres](https://api-using-spotify-data.vercel.app/API-Spotify-A1/genres)
- [/api/songs](https://api-using-spotify-data.vercel.app/API-Spotify-A1/songs)
- [/api/songs/sort/artist](https://api-using-spotify-data.vercel.app/API-Spotify-A1/songs/sort/artist)
- [/api/songs/sort/year](https://api-using-spotify-data.vercel.app/API-Spotify-A1/songs/sort/year)
- [/api/songs/sort/duration](https://api-using-spotify-data.vercel.app/API-Spotify-A1/songs/sort/duration)
- [/api/songs/1010](https://api-using-spotify-data.vercel.app/API-Spotify-A1/songs/1010)
- [/api/songs/sjdkfhsdkjf](https://api-using-spotify-data.vercel.app/API-Spotify-A1/songs/sjdkfhsdkjf)
- [/api/songs/search/begin/love](https://api-using-spotify-data.vercel.app/API-Spotify-A1/songs/search/begin/love)
- [/api/songs/search/begin/sdjfhs](https://api-using-spotify-data.vercel.app/API-Spotify-A1/songs/search/begin/sdjfhs)
- [/api/songs/search/any/love](https://api-using-spotify-data.vercel.app/API-Spotify-A1/songs/search/any/love)
- [/api/songs/search/year/2017](https://api-using-spotify-data.vercel.app/API-Spotify-A1/songs/search/year/2017)
- [/api/songs/search/year/2027](https://api-using-spotify-data.vercel.app/API-Spotify-A1/songs/search/year/2027)
- [/api/songs/artist/149](https://api-using-spotify-data.vercel.app/API-Spotify-A1/songs/artist/149)
- [/api/songs/artist/7834562](https://api-using-spotify-data.vercel.app/API-Spotify-A1/songs/artist/7834562)
- [/api/songs/genre/115](https://api-using-spotify-data.vercel.app/API-Spotify-A1/songs/genre/115)
- [/api/playlists](https://api-using-spotify-data.vercel.app/API-Spotify-A1/playlists)
- [/api/playlists/3](https://api-using-spotify-data.vercel.app/API-Spotify-A1/playlists/3)
- [/api/playlists/35362](https://api-using-spotify-data.vercel.app/API-Spotify-A1/playlists/35362)
- [/api/mood/dancing/5](https://api-using-spotify-data.vercel.app/API-Spotify-A1/mood/dancing/5)
- [/api/mood/dancing/500](https://api-using-spotify-data.vercel.app/API-Spotify-A1/mood/dancing/500)
- [/api/mood/dancing/ksdjf](https://api-using-spotify-data.vercel.app/API-Spotify-A1/mood/dancing/ksdjf)
- [/api/mood/happy/8](https://api-using-spotify-data.vercel.app/API-Spotify-A1/mood/happy/8)
- [/api/mood/happy](https://api-using-spotify-data.vercel.app/API-Spotify-A1/mood/happy)
- [/api/mood/coffee/10](https://api-using-spotify-data.vercel.app/API-Spotify-A1/mood/coffee/10)
- [/api/mood/studying/15](https://api-using-spotify-data.vercel.app/API-Spotify-A1/mood/studying/15)

