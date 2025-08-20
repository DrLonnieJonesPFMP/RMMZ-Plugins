/*:
 * @plugindesc v1.03
 * @author DreamX
 * 
 * @param Races
 * @desc List the race file names without the number at the end, seperated by space. Example: Human Elf Orc
 * @default 
 * 
 * @param Sheet Max
 * @desc Maximum amount of number added at end of race file name
 * @default 3
 * 
 * @help
 * ============================================================================
 * How To Use
 * ============================================================================
 *
 * ============================================================================
 * Terms Of Use
 * ============================================================================
 * Free to use and modify for commercial and noncommercial games, with credit.
 * ============================================================================
 * Credits
 * ============================================================================
 * DreamX
 */

var Imported = Imported || {};
Imported.DreamX_RandomizeCharacter = true;

var DreamX = DreamX || {};
DreamX.RandomizeCharacter = DreamX.RandomizeCharacter || {};

(function () {
    var parameters = PluginManager.parameters('DreamX_RandomizeCharacterForSkurge');
    var paramRaces = String(parameters['Races']).split(" ");
    var paramMax = parseInt(String(parameters['Sheet Max']));

    DreamX.RandomizeCharacter.Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function (mapId, eventId) {
        DreamX.RandomizeCharacter.Game_Event_initialize.call(this, mapId, eventId);

        if (!this.event().meta.RandomizeCharacter) {
            return;
        }
        
        this.randomizeEventRace();
    };

    Game_Event.prototype.randomizeEventRace = function () {
        var races = paramRaces;
        var race = races[Math.floor(Math.random() * races.length)];

        var presetRace = this.event().meta.RCRace;
        if (presetRace) {
            race = presetRace.trim();
        }

        var number = Math.floor(Math.random() * paramMax) + 1;
        var index = Math.floor(Math.random() * 8);

        this._randomlyChosenCharacterName = race + number;
        this._randomlyChosenCharacterIndex = index;

        this.setImage(this._randomlyChosenCharacterName, this._randomlyChosenCharacterIndex);
    };

    DreamX.RandomizeCharacter.Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
    Game_Event.prototype.setupPageSettings = function () {
        var originalDirection = this.direction();
        DreamX.RandomizeCharacter.Game_Event_setupPageSettings.call(this);
        var char = this._randomlyChosenCharacterName;
        var index = this._randomlyChosenCharacterIndex;

        if (char && index !== undefined) {
            this.setImage(this._randomlyChosenCharacterName, this._randomlyChosenCharacterIndex);
            //this.setDirection(originalDirection);
        }
    };

    if (Imported.Galv_EventSpawner) {
        alias_DataManager_onLoad = DataManager.onLoad;
        DataManager.onLoad = function (object) {
            alias_DataManager_onLoad.call(this, object);
            var array;
            if (object === $dataSpawnMap) {
                this.extractMetadata(object);
                array = object.events;
            } else {
                array = object;
            }
            if (Array.isArray(array)) {
                for (var i = 0; i < array.length; i++) {
                    var data = array[i];
                    if (data && data.note !== undefined) {
                        this.extractMetadata(data);
                    }
                }
            }
        };
    }


})();
