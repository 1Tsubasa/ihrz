/*
・ iHorizon Discord Bot (https://github.com/ihrz/ihrz)

・ Licensed under the Attribution-NonCommercial-ShareAlike 2.0 Generic (CC BY-NC-SA 2.0)

    ・   Under the following terms:

        ・ Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.

        ・ NonCommercial — You may not use the material for commercial purposes.

        ・ ShareAlike — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

        ・ No additional restrictions — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.


・ Mainly developed by Kisakay (https://github.com/Kisakay)

・ Copyright © 2020-2023 iHorizon
*/

const logger = require(`${process.cwd()}/src/core/logger`);

module.exports = function () {
    let _now2 = new Date();

    let _dateStr = `${_now2.toLocaleString('default', { day: '2-digit' })} ${_now2.toLocaleString('default', { month: 'short' })} ${_now2.getFullYear().toString().substr(-2)} ${_now2.toLocaleTimeString('en-US', { hour12: false })} 2023`;
    
    console.log(`The clock are on ${_dateStr}`)
};