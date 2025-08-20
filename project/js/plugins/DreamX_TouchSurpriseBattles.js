/*:
 * @plugindesc v1.4a Battle type depends on touch. Make sure to set the switch parameters.
 * <DreamX Touch Surprise Battles>
 * @author DreamX
 *
 * @param Preemptive Switch
 * @desc This switch decides whether the next battle will be preemptive. You must set this in order to use the plugin.
 * @default 
 *
 * @param Surprise Switch
 * @desc This switch decides whether the next battle will be surprise. You must set this in order to use the plugin.
 * @default 
 *
 * @param Force Switch
 * @desc This switch decides whether the next battle will be forced to be a certain way. You must set this in order to use the plugin.
 * @default 
 * 
 * @param Back Preemptive Chance
 * @desc The % chance to have a preemptive battle when the player touches the event from the back. Default: 100
 * @default 100
 *
 * @param Back Surprise Chance
 * @desc The % chance to have a surprise battle when the event touches the player from the back. Default: 100
 * @default 100
 *
 * @param Side Preemptive Chance
 * @desc The % chance to have a preemptive battle when the player touches the event from the side. Default: 0
 * @default 0
 * 
 * @param Side Surprise Chance
 * @desc The % chance to have a surprise battle when the event touches the player from the side. Default: 0
 * @default 0
 *
 * @help
 Make sure to set the switches in the parameters or the script won't do 
 anything.
 Put <enemy:1> into an event so that when the player and it touches, it'll 
 set the next battle type depending on how they touched (you touch their 
 back = preemptive, they touch your back =  surprise, otherwise = normal).
 
 The following plugin commands do not apply to random battle encounters you 
 get from walking around on the map (it does apply to battle processing event 
 commands that are "same as random encounter," though). 
 
 Plugin Commands: 
 ForceSurpriseBattle - Forces the next battle to be surprise. 
 ForcePreemptiveBattle - Forces the next battle to be preemptive.
 ForceNormalBattle - Forces the next battle to be normal.
 ResetBattleType - Removes the forced state. If the event is labeled <enemy:1>, 
 the battle type will be decided by direction again.
 * ============================================================================
 * Patch Notes
 * ============================================================================
 * v1.4a (1/23/16): Fixed compatibility for Orange Custom Events.
 * v1.4 (1/23/16): Added compatibility for Orange Custom Events.
 * v1.3 (1/16/16): Added parameters for back preemptive/surprise battles chance.
 * v1.2 (1/14/16): Plugin commands now apply to touch <enemy:1> events.
 * v1.1 (1/12/16): Fixed bug with maps that don't have all events sequentially
 * ordered (for example, if you delete an event) and added compatibility for
 * Sanshiro's Map Generator.
 * ============================================================================
 * Terms Of Use
 * ============================================================================
 * Free to use and modify for commercial and noncommercial games, with credit.
 * Credit both DreamX and Jeneeus Guruman.
 * ============================================================================
 * Credits
 * ============================================================================
 * DreamX
 * Jeneeus Guruman - Preemptive-Surprise Event Battle
 *      Script portions used, modified or referenced in this plugin:
 *      Jene.gameInterpreterCommand301
 *      Jene.gameCharacterBaseSetDirection
 *      Game_Interpreter.prototype.preemptiveOrSurprise
 *      Script source: http://forums.rpgmakerweb.com/index.php?/topic/46769-preemptive-surprise-event-battle/
 */

var Imported = Imported || {};
Imported.DreamX_TouchSurpriseBattles = true;
var DreamX = DreamX || {};
DreamX.TouchSurpriseBattles = DreamX.TouchSurpriseBattles || {};

(function () {


    var parameters = $plugins.filter(function (p) {
        return p.description.contains('<DreamX Touch Surprise Battles>');
    })[0].parameters; //Thanks to Iavra

    var preSwitch = parseInt(parameters['Preemptive Switch'] || '-1');
    var surSwitch = parseInt(parameters['Surprise Switch'] || '-1');
    var forceSwitch = parseInt(parameters['Force Switch'] || '-1');
    var backPreChance = parseInt(parameters['Back Preemptive Chance'] || '100');
    var backSurChance = parseInt(parameters['Back Surprise Chance'] || '100');
    var sidePreChance = parseInt(parameters['Side Preemptive Chance'] || '0');
    var sideSurChance = parseInt(parameters['Side Surprise Chance'] || '0');

    DreamX.TouchSurpriseBattles._Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        DreamX.TouchSurpriseBattles._Game_Interpreter_pluginCommand.call(this, command, args);
        if (DreamX.TouchSurpriseBattles.CorrectSwitches()) {
            switch (command) {
                case 'ForceSurpriseBattle':
                    DreamX.TouchSurpriseBattles.SurpriseOn();
                    break;
                case 'ForcePreemptiveBattle':
                    DreamX.TouchSurpriseBattles.PreemptiveOn();
                    break;
                case 'ForceNormalBattle':
                    DreamX.TouchSurpriseBattles.NormalOn();
                    break;
                case 'ResetBattleType':
                    DreamX.TouchSurpriseBattles.Reset();
                    break;
            }
        }
    };

    DreamX.TouchSurpriseBattles.CorrectSwitches = function () {
        if (parseInt(preSwitch) >= 1 && parseInt(surSwitch) >= 1 && parseInt(forceSwitch) >= 1) {
            return true;
        }
        return false;
    };

    DreamX.TouchSurpriseBattles.SurpriseOn = function () {
        $gameSwitches.setValue(preSwitch, false);
        $gameSwitches.setValue(surSwitch, true);
        $gameSwitches.setValue(forceSwitch, true);
    };

    DreamX.TouchSurpriseBattles.PreemptiveOn = function () {
        $gameSwitches.setValue(preSwitch, true);
        $gameSwitches.setValue(surSwitch, false);
        $gameSwitches.setValue(forceSwitch, true);
    };

    DreamX.TouchSurpriseBattles.NormalOn = function () {
        $gameSwitches.setValue(preSwitch, false);
        $gameSwitches.setValue(surSwitch, false);
        $gameSwitches.setValue(forceSwitch, true);
    };

    DreamX.TouchSurpriseBattles.Reset = function () {
        $gameSwitches.setValue(preSwitch, false);
        $gameSwitches.setValue(surSwitch, false);
        $gameSwitches.setValue(forceSwitch, false);
    };

    DreamX.TouchSurpriseBattles.Game_Event_initMembers
            = Game_Event.prototype.initMembers;
    Game_Event.prototype.initMembers = function () {
        DreamX.TouchSurpriseBattles.Game_Event_initMembers.call(this);
        this._previousDirection = -1;
    };

    DreamX.TouchSurpriseBattles.Game_CharacterBase_setDirection
            = Game_CharacterBase.prototype.setDirection;
    Game_CharacterBase.prototype.setDirection = function (d) {
        if (!this.isDirectionFixed() && this._direction !== 0) {
            this._previousDirection = this._direction;
        }
        DreamX.TouchSurpriseBattles.Game_CharacterBase_setDirection.call(this, d);
    };

    DreamX.TouchSurpriseBattles.Game_Interpreter_command301
            = Game_Interpreter.prototype.command301;
    Game_Interpreter.prototype.command301 = function () {
        if ($gameSwitches.value(forceSwitch) === false) {
            var eventId = this.eventId();
            var dataId = this.eventId();
            var isEnemy = false;
            var event = $gameMap.events().filter(function (event) {
                return event.eventId() === eventId;
            });
            event = event[0];

            if (Imported.SAN_MapGenerator && $gameMap._mapGenerator) {
                dataId = event._dataEventId;
            }
            if (Imported["OrangeCustomEvents"] && event._eventData) {
                if (event._eventData.meta && event._eventData.meta.enemy) {
                    isEnemy = true;
                }
                if (event._eventData.note && event._eventData.note.contains("\<enemy:1\>")) {
                    isEnemy = true;
                }
            }
            if ($dataMap.events[dataId] && $dataMap.events[dataId].meta.enemy)
                isEnemy = true;
            if (isEnemy) {
                DreamX.TouchSurpriseBattles.SetBattleType(DreamX.TouchSurpriseBattles.CheckBattleType(event));
            }
        }
        return DreamX.TouchSurpriseBattles.Game_Interpreter_command301.call(this);
    };

    DreamX.TouchSurpriseBattles.BattleManager_initMembers
            = BattleManager.initMembers;
    BattleManager.initMembers = function () {
        DreamX.TouchSurpriseBattles.BattleManager_initMembers.call(this);
        this._preemptive = $gameSwitches.value(preSwitch);
        this._surprise = $gameSwitches.value(surSwitch);
        DreamX.TouchSurpriseBattles.Reset();
    };

    DreamX.TouchSurpriseBattles.SetBattleType = function (type) {
        if (type === 'preemptive') {
            $gameSwitches.setValue(preSwitch, true);
            $gameSwitches.setValue(surSwitch, false);
        }

        else if (type === 'surprise') {
            $gameSwitches.setValue(preSwitch, false);
            $gameSwitches.setValue(surSwitch, true);
        }
        else {
            $gameSwitches.setValue(preSwitch, false);
            $gameSwitches.setValue(surSwitch, false);
        }
    };

    DreamX.TouchSurpriseBattles.SideSurprise = function () {
        var diceRoll = Math.floor((Math.random() * 100) + 1);
        if (diceRoll <= sideSurChance) {
            return 'surprise';
        }
        return 'normal';
    };

    DreamX.TouchSurpriseBattles.SidePreemptive = function () {
        var diceRoll = Math.floor((Math.random() * 100) + 1);
        if (diceRoll <= sidePreChance) {
            return 'preemptive';
        }
        return 'normal';
    };

    DreamX.TouchSurpriseBattles.BackPreemptive = function () {
        var diceRoll = Math.floor((Math.random() * 100) + 1);
        if (diceRoll <= backPreChance) {
            return 'preemptive';
        }
        return 'normal';
    };

    DreamX.TouchSurpriseBattles.BackSurprise = function () {
        var diceRoll = Math.floor((Math.random() * 100) + 1);
        if (diceRoll <= backSurChance) {
            return 'surprise';
        }
        return 'normal';
    };


    DreamX.TouchSurpriseBattles.IsPlayerFacingEvent = function (playerDir, event) {

        if (playerDir === 4) {
            if ($gamePlayer.x > event.x) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (playerDir === 6) {
            if ($gamePlayer.x < event.x) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (playerDir === 2) {

            if ($gamePlayer.y < event.y) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (playerDir === 8) {
            if ($gamePlayer.y > event.y) {
                return true;
            }
            else {
                return false;
            }
        }
    };


    DreamX.TouchSurpriseBattles.CheckBattleType = function (event) {
        var playerDir = $gamePlayer.direction();
        var prevEventDir = event._previousDirection;
        if (prevEventDir === -1)
            prevEventDir = event.direction();
        // check surprise or preemptive
        if (playerDir === prevEventDir) {
            if (playerDir === 4) {
                if ($gamePlayer.x > event.x) {
                    return DreamX.TouchSurpriseBattles.BackPreemptive();
                }
                else {
                    return DreamX.TouchSurpriseBattles.BackSurprise();
                }
            }
            else if (playerDir === 6) {
                if ($gamePlayer.x > event.x) {
                    return DreamX.TouchSurpriseBattles.BackSurprise();
                }
                else {
                    return DreamX.TouchSurpriseBattles.BackPreemptive();
                }
            }
            else if (playerDir === 2) {
                if ($gamePlayer.y > event.y) {
                    return DreamX.TouchSurpriseBattles.BackSurprise();
                }
                else {
                    return DreamX.TouchSurpriseBattles.BackPreemptive();
                }
            }
            else if (playerDir === 8) {
                if ($gamePlayer.y > event.y) {
                    return DreamX.TouchSurpriseBattles.BackPreemptive();
                }
                else {
                    return DreamX.TouchSurpriseBattles.BackSurprise();
                }
            }
        }
        // if not facing each other
        if (10 - playerDir !== prevEventDir) {
            var isPlayerFacingEvent =
                    DreamX.TouchSurpriseBattles.IsPlayerFacingEvent(playerDir, event);
            if (isPlayerFacingEvent) {
                return DreamX.TouchSurpriseBattles.SidePreemptive();
            }
            else {
                return DreamX.TouchSurpriseBattles.SideSurprise();
            }
        }
        return 'normal';
    };

})();
