import * as React from 'react';
import classnames from 'classnames';
import {ReactSortable} from 'react-sortablejs';

import {MediaPlayerContext, SongState} from '~/MediaPlayerState';
import {SVG} from '~/components/svg';

import deleteIcon from '~/img/delete.svg';

export const MediaPlaylist = () => {
  const {state, dispatch} = React.useContext(MediaPlayerContext);

  const playClickHandler = (id: string) => {
    dispatch({
      type: 'PLAY_SONG',
      value: id
    });
  };

  const deleteClickHandler = (song: SongState) => {
    dispatch({
      type: 'REMOVE_SONG',
      value: song.id
    });
  };

  const sortPlaylistHandler = (playlist) => {
    dispatch({
      type: 'SORT_PLAYLIST',
      value: playlist
    });
  };

  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 overflow-y-scroll" style={{right: -17}}>
      <ReactSortable list={state.songs} setList={sortPlaylistHandler}>
        {state.songs.map((song, i) => {
          const isCurrent = state.player?.currentSongId === song.id;
          return (
            <div
              key={song.id}
              className={classnames(
                'group grid grid-cols-10 border-b border-gray-800 cursor-pointer hover:bg-gray-800',
                'items-center',
                {'text-green-500': isCurrent},
                {'text-gray-300': !isCurrent}
              )}
            >
              <div className="flex flex-row items-center p-2 col-span-6" onClick={() => playClickHandler(song.id)}>
                <div className="items-center justify-center flex-shrink-0 w-8 h-6 mr-2 text-center text-gray-700">
                  {i + 1}
                </div>
                <div
                  className="w-10 h-10 mr-2 bg-gray-900"
                  style={{
                    backgroundImage: `url(https://img.youtube.com/vi/${song.id}/mqdefault.jpg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center'
                  }} />
                <div className="flex-1 hover:text-green-200">{song.title}</div>
              </div>
              <div className="p-2 col-span-2 opacity-60">{song.uploader}</div>
              <div className="p-2 col-span-1"></div>
              <div className="p-2 col-span-1">
                <button
                  className={classnames(
                    'w-8 h-8 flex float-right mx-5 items-center justify-center text-white opacity-10 hover:opacity-100 hover:text-red-500'
                  )}
                  onClick={() => deleteClickHandler(song)}
                >
                  <SVG content={deleteIcon} />
                </button>
              </div>
            </div>
          );
        })}
      </ReactSortable>
    </div>
  );
};

