/*
MagicWalker by https://vk.com/mineprogramming
Покажи всем, насколько ты крут в Майнкрафте! 
Установи этот мод, открой карту для игры по сети и пусть друзья увидят, кто лучший майнкрафтер в мире! 
ЗЫ: ты будешь получать алмазы и за тобой будет оставатся красивый шлейф из частиц
*/

var ticks = 10; //так алмазы будут появлятся в 10 раз реже - этого вполне достаточно для красивого эффекта

function AddRandomParticle(type){ //чтобы было меньше строчек кода, объявим функцию
    var x = Player.getX() + Math.random() - 0.5;
    var z = Player.getZ() + Math.random() - 0.5; //вокруг игрока в радиусе пол-блока
    var y = Player.getY() - 1 - Math.random(); //так частицы всегда появляются где-то в районе ног

    Level.addParticle(type, x, y, z, 0, 0, 0);//тип частицы передается в функцию
}

function modTick() { //20 раз в секунду
    ticks--;
    if(ticks <= 0){
        ticks = 10; //обновим счетчик и будем дропать алмазы!
        Level.dropItem(Player.getX(), Player.getY() - 1, Player.getZ(), 0, 264, 1);
    }
    for(var i = 1; i < 5; i++){ //побольше частиц!!!
        AddRandomParticle(ParticleType.crit); //критический удар
        AddRandomParticle(ParticleType.dripLava); //капли, как с потолка, над которым лава
        AddRandomParticle(ParticleType.dripWater); //то же самое, но с водой
        AddRandomParticle(ParticleType.happyVillager); //частицы, если с жителем поторговаться (на пк, естественно)
    }
}