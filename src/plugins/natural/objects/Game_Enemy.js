//region Game_Enemy
/**
 * Extends {@link Game_Enemy.setup}.<br>
 * Includes parameter buff initialization.
 */
J.NATURAL.Aliased.Game_Enemy.set('setup', Game_Enemy.prototype.setup);
Game_Enemy.prototype.setup = function(enemyId, x, y)
{
  // perform original logic.
  J.NATURAL.Aliased.Game_Enemy.get('setup')
    .call(this, enemyId, x, y);

  // initialize the parameter buffs on this battler.
  this.refreshAllParameterBuffs();
};

/**
 * Extends {@link #onBattlerDataChange}.<br>
 * Also refreshes all natural parameter buff values on the battler.
 */
J.NATURAL.Aliased.Game_Enemy.set('onBattlerDataChange', Game_Enemy.prototype.onBattlerDataChange);
Game_Enemy.prototype.onBattlerDataChange = function()
{
  // perform original logic.
  J.NATURAL.Aliased.Game_Enemy.get('onBattlerDataChange')
    .call(this);

  // refresh all our buffs, something could've changed.
  this.refreshAllParameterBuffs();
};

//region max tp
/**
 * OVERWRITE Replaces the `maxTp()` function with our custom one that will respect
 * formulas and apply rates from tags, etc.
 * @returns {number}
 */
Game_Enemy.prototype.maxTp = function()
{
  // calculate our actual max tp.
  return this.actualMaxTp();
};

/**
 * Gets the base max tp for this enemy.
 * @returns {number}
 */
Game_Enemy.prototype.getBaseMaxTp = function()
{
  return J.NATURAL.Metadata.BaseTpMaxEnemies;
};
//endregion max tp

//region b params
/**
 * Extends `.paramBase()` to include any additional growth bonuses as part of the base.
 */
J.NATURAL.Aliased.Game_Enemy.set('paramBase', Game_Enemy.prototype.paramBase);
Game_Enemy.prototype.paramBase = function(paramId)
{
  // get original value.
  const baseParam = J.NATURAL.Aliased.Game_Enemy.get('paramBase')
    .call(this, paramId);

  // determine the structure for this parameter.
  const paramBaseNaturalBonuses = this.paramBaseNaturalBonuses(paramId);

  // return result.
  return (baseParam + paramBaseNaturalBonuses);
};

/**
 * This is exclusively for access to the natural growth values, without the base parameter value added.
 * @param {number} paramId The parameter id in question.
 * @returns {number}
 */
Game_Enemy.prototype.paramBaseNaturalBonuses = function(paramId)
{
  // determine the structure for this parameter.
  const structures = this.getRegexByParamId(paramId);

  // if there is no regexp, then don't try to do things.
  if (!structures) return 0;

  // get original value.
  const baseParam = J.NATURAL.Aliased.Game_Enemy.get('paramBase')
    .call(this, paramId);

  // destructure into the plus and rate regexp structures.
  const paramNaturalBonuses = this.getParamBaseNaturalBonuses(paramId, baseParam);

  // return result.
  return (paramNaturalBonuses);
};

/**
 * Gets all natural growths for this base parameter.
 * Enemies only have buffs.
 * @param {number} paramId The parameter id in question.
 * @param {number} baseParam The base parameter.
 * @returns {number} The added value of the `baseParam` + `paramBuff` + `paramGrowth`.
 */
Game_Enemy.prototype.getParamBaseNaturalBonuses = function(paramId, baseParam)
{
  // determine temporary buff for this param.
  return this.calculateBParamBuff(paramId, baseParam);
};
//endregion b params

//region ex params
/**
 * Extends `.xparam()` to include any additional growth bonuses.
 */
J.NATURAL.Aliased.Game_Enemy.set('xparam', Game_Enemy.prototype.xparam);
Game_Enemy.prototype.xparam = function(xparamId)
{
  // get original value.
  const baseParam = J.NATURAL.Aliased.Game_Enemy.get('xparam')
    .call(this, xparamId);

  // determine the structure for this parameter.
  const xparamNaturalBonuses = this.xparamNaturalBonuses(xparamId);

  // return result.
  return (baseParam + xparamNaturalBonuses);
};

/**
 * This is exclusively for access to the natural growth values, without the ex-parameter value added.
 * @param {number} xparamId The parameter id in question.
 * @returns {number}
 */
Game_Enemy.prototype.xparamNaturalBonuses = function(xparamId)
{
  // get original value.
  const baseParam = J.NATURAL.Aliased.Game_Enemy.get('xparam')
    .call(this, xparamId);

  // determine the structure for this parameter.
  const structures = this.getRegexByExParamId(xparamId);

  // if there is no regexp, then don't try to do things.
  if (!structures) return 0;

  // destructure into the plus and rate regexp structures.
  return this.getXparamNaturalBonuses(xparamId, baseParam);
};

/**
 * Gets all natural growths for this ex-parameter.
 * @param {number} xparamId The parameter id in question.
 * @param {number} baseParam The base parameter.
 * @returns {number} The added value of the `baseParam` + `paramBuff` + `paramGrowth`.
 */
Game_Enemy.prototype.getXparamNaturalBonuses = function(xparamId, baseParam)
{
  // determine temporary buff for this param.
  return this.calculateExParamBuff(xparamId, baseParam);
};
//endregion ex params

//region sp params
/**
 * Extends `.sparam()` to include any additional growth bonuses.
 */
J.NATURAL.Aliased.Game_Enemy.set('sparam', Game_Enemy.prototype.sparam);
Game_Enemy.prototype.sparam = function(sparamId)
{
  // get original value.
  const baseParam = J.NATURAL.Aliased.Game_Enemy.get('sparam')
    .call(this, sparamId);

  // determine the structure for this parameter.
  const sparamNaturalBonuses = this.sparamNaturalBonuses(sparamId);

  // return result.
  return (baseParam + sparamNaturalBonuses);
};

/**
 * This is exclusively for access to the natural growth values, without the sp-parameter value added.
 * @param {number} sparamId The parameter id in question.
 * @returns {number}
 */
Game_Enemy.prototype.sparamNaturalBonuses = function(sparamId)
{
  // get original value.
  const baseParam = J.NATURAL.Aliased.Game_Enemy.get('sparam')
    .call(this, sparamId);

  // determine the structure for this parameter.
  const structures = this.getRegexBySpParamId(sparamId);

  // if there is no regexp, then don't try to do things.
  if (!structures) return 0;

  // destructure into the plus and rate regexp structures.
  return this.getSparamNaturalBonuses(sparamId, baseParam);
};

/**
 * Gets all natural growths for this sp-parameter.
 * Enemies only have buffs.
 * @param {number} sparamId The parameter id in question.
 * @param {number} baseParam The base parameter.
 * @returns {number} The added value of the `baseParam` + `paramBuff` + `paramGrowth`.
 */
Game_Enemy.prototype.getSparamNaturalBonuses = function(sparamId, baseParam)
{
  // determine temporary buff for this param.
  return this.calculateSpParamBuff(sparamId, baseParam);
};
//endregion sp params

//region rewards
/**
 * Overrides {@link #refreshRewardBonuses}.<br>
 * Implements the refresh for battle reward bonuses for the enemy.
 */
Game_Enemy.prototype.refreshRewardBonuses = function()
{
  this.refreshExpRewardBonuses();
  this.refreshGoldRewardBonuses();
};

/**
 * Refreshes the experience reward bonuses for this enemy.
 */
Game_Enemy.prototype.refreshExpRewardBonuses = function()
{
  // add the extracted formulai to an array.
  const expBonusFormulai = this.extractParameterFormulai(J.NATURAL.RegExp.RewardExp);

  // if no formulai were found, then stop processing.
  if (!expBonusFormulai.length) return;

  // calculate all formulai found for this enemy that could affect experience.
  const bonusExp = this.naturalParamBuff(J.NATURAL.RegExp.RewardExp, this.enemy().exp);

  // update the experience reward bonus.
  this.setExpPlus(bonusExp);
};

/**
 * Refreshes the gold reward bonuses for this enemy.
 */
Game_Enemy.prototype.refreshGoldRewardBonuses = function()
{
  // add the extracted formulai to an array.
  const goldBonusFormulai = this.extractParameterFormulai(J.NATURAL.RegExp.RewardGold);

  // if no formulai were found, then stop processing.
  if (!goldBonusFormulai.length) return;

  // calculate all formulai found for this enemy that could affect gold.
  const bonusGold = this.naturalParamBuff(J.NATURAL.RegExp.RewardGold, this.enemy().gold);

  // update the gold reward bonus.
  this.setGoldPlus(bonusGold);
};

/**
 * Extends {@link #exp}.<br>
 * Also adds on any natural bonuses of experience.
 * @returns {number}
 */
J.NATURAL.Aliased.Game_Enemy.set("exp", Game_Enemy.prototype.exp);
Game_Enemy.prototype.exp = function()
{
  // grab the original value.
  const baseReward = J.NATURAL.Aliased.Game_Enemy.get("exp")
    .call(this);

  // grab the bonus experience rewards.
  const expBonus = this.expPlus();

  // return the combined value.
  return (baseReward + expBonus);
};

/**
 * Extends {@link #gold}.<br>
 * Also adds on any natural bonuses of gold.
 * @returns {number}
 */
J.NATURAL.Aliased.Game_Enemy.set("gold", Game_Enemy.prototype.gold);
Game_Enemy.prototype.gold = function()
{
  // grab the original value.
  const baseReward = J.NATURAL.Aliased.Game_Enemy.get("gold")
    .call(this);

  // grab the bonus gold rewards.
  const goldBonus = this.goldPlus();

  // return the combined value.
  return (baseReward + goldBonus);
};
//endregion rewards
//endregion Game_Enemy