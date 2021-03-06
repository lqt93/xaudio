import * as React from 'react';
import classnames from 'classnames';

import {MediaPlayerContext} from '~/context';
import {SVG} from '~/components/svg';
import {API} from '~/lib/api';

import spinnerIcon from '~/img/spinner.svg';
import searchIcon from '~/img/search.svg';
import plusIcon from '~/img/plus.svg';
import checkIcon from '~/img/check.svg';
import closeIcon from '~/img/delete.svg';

export const SearchEntries = ({ items }) => {
  const { state, dispatch } = React.useContext(MediaPlayerContext);

  const addSongHandler = ({ title, id, uploader }) => {
    dispatch({
      type: 'ADD_SONG',
      value: { title, id, uploader, listenCount: 0 }
    });
  };

  const previewSongHandler = ({ title, id, uploader }) => {
    dispatch({
      type: 'PLAY_SONG',
      value: { title, id, uploader }
    });
  };

  const shouldDisabled = (item) => {
    const found = state.songs.find((s) => s.id === item.id);
    return found !== undefined;
  };

  return items.map((item, i) => {
    const disabled = shouldDisabled(item);
    return (
      <li
        key={i}
        className={classnames('group p-3 border-b border-gray-700 flex flex-row cursor-pointer hover:bg-gray-800', {
          'opacity-25 pointer-events-none': disabled
        })}
      >
        <div
          onClick={() => addSongHandler(item)}
          className={classnames(
            'w-8 h-8 mr-2 flex items-center justify-center flex-shrink-0',
            { 'text-white hover:text-green-500': !disabled },
            { 'text-gray-600': disabled }
          )}
        >
          <SVG content={disabled ? checkIcon : plusIcon} />
        </div>
        <div
          className="w-10 h-10 mr-2 bg-gray-900"
          style={{
            backgroundImage: `url(https://img.youtube.com/vi/${item.id}/mqdefault.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center'
          }}
        />
        <div
          className="items-center flex-1"
          onClick={() => previewSongHandler(item)}
        >
          <div className="text-sm md:text-base text-white pr-2 md:p-0">{item.title}</div>
          <div className="flex flex-row text-sm text-gray-500">
            <div className="flex-1 text-left">{item.uploader}</div>
            <div className="flex-1 font-medium text-right"/>
          </div>
        </div>
      </li>
    );
  });
};

const SearchArea = () => {
  const searchInputRef = React.useRef<HTMLInputElement>();
  const [loading, setLoading] = React.useState(false);
  const [searchResult, setSearchResult] = React.useState([]);

  const keyPressHandler = async (e) => {
    if (e.key === 'Enter') {
      const query = searchInputRef?.current?.value;
      if (query) {
        setLoading(true);
        const results = await API.search(query);
        setLoading(false);
        setSearchResult(results);
      }
    }
  };

  return (
    <React.Fragment>
      <div className="flex flex-row items-center flex-shrink-0 px-4 py-2 m-3 text-white bg-gray-600 rounded-full">
        <div className="flex-shrink-0 mr-3">
          <SVG content={searchIcon} />
        </div>
        <input
          className="flex-1 text-white bg-gray-600 focus:outline-none"
          ref={searchInputRef}
          type="text"
          placeholder="Search by song title or artist..."
          onKeyPress={keyPressHandler} />
      </div>
      {loading ? (
        <div className="w-5 h-5 mx-auto my-5 text-white animate-spin">
          <SVG content={spinnerIcon} />
        </div>
      ) : (
        <div className="relative flex-1 overflow-hidden">
          <ul className="absolute top-0 bottom-0 left-0 right-0 overflow-y-scroll" style={{ right: -17 }}>
            <SearchEntries items={searchResult} />
          </ul>
        </div>
      )}
    </React.Fragment>
  );
};

const SuggestionArea = () => {
  const { state } = React.useContext(MediaPlayerContext);
  const [loading, setLoading] = React.useState(false);
  const [searchResult, setSearchResult] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      const currentSong = state.player?.currentSong;
      if (currentSong) {
        setLoading(true);
        const results = await API.getSimilarSongs(currentSong.id);
        setLoading(false);
        setSearchResult(results);
      }
    })();
  }, [state.player?.currentSong]);

  return (
    <React.Fragment>
      <div className="p-3 text-white">{state.player?.currentSong ? "You might also like" : "Play some music to get suggestion"}</div>
      {loading ? (
        <div className="w-5 h-5 mx-auto my-5 text-white animate-spin">
          <SVG content={spinnerIcon} />
        </div>
      ) : (
        <div className="relative flex-1 overflow-hidden">
          <ul className="absolute top-0 bottom-0 left-0 right-0 overflow-y-scroll" style={{ right: -17 }}>
            <SearchEntries items={searchResult} />
          </ul>
        </div>
      )}
    </React.Fragment>
  );
};

enum DRAWER_MODE {
  SUGGESTION,
  SEARCH
};

export const DrawerArea = ({ isOpen, toggleDrawerHandler }) => {
  const [mode, setMode] = React.useState(DRAWER_MODE.SUGGESTION);

  return (
    <div
      id="search-area"
      className={classnames(
        `flex flex-col bg-gray-800 border-l border-gray-700 shadow-lg opacity-80 transition-all`,
        { 'w-full md:w-3/12': isOpen },
        { 'w-0': !isOpen }
      )}
    >
      {isOpen && (
        <React.Fragment>
          {/* Close button */}
          <button
            className={
              'text-white opacity-50 hover:opacity-100 flex flex-row items-center absolute top-0 right-0 p-3 focus:outline-none'
            }
            onClick={toggleDrawerHandler}
          >
            <SVG content={closeIcon} />
          </button>

          {/* Tab navigation */}
          <div className="text-white flex flex-row">
            <button
              className={classnames(
                "px-1 py-2 m-3 opacity-50 hover:opacity-100 cursor-pointer focus:outline-none",
                { "border-b-2 border-white opacity-100": mode === DRAWER_MODE.SUGGESTION }
              )}
              onClick={() => setMode(DRAWER_MODE.SUGGESTION)}
            >
              Suggestion
            </button>
            <button
              className={classnames(
                "px-1 py-2 m-3 opacity-50 hover:opacity-100 cursor-pointer focus:outline-none",
                { "border-b-2 border-white opacity-100": mode === DRAWER_MODE.SEARCH }
              )}
              onClick={() => setMode(DRAWER_MODE.SEARCH)}
            >
              Search
            </button>
          </div>

          {/* Drawer content */}
          {mode === DRAWER_MODE.SEARCH && <SearchArea/>}
          {mode === DRAWER_MODE.SUGGESTION && <SuggestionArea/>}
        </React.Fragment>
      )}
    </div>
  );
};