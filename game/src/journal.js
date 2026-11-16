export function journalLine(stats,hp,maxHp){
 if(stats.leaks===0)return 'I kept every shadow from the shore tonight.';
 if(hp===1)return 'One light remains. I will tend it until morning.';
 if(stats.leaks>=3)return 'Too many shadows reached the stone. I must watch more closely.';
 if(stats.kills>=20)return 'Twenty shadows or more fell beneath my light tonight.';
 if(hp===maxHp)return 'The lanterns are whole again, though shadows reached the shore.';
 return 'Shadows reached the stone. I still have a light to tend.';
}
export function keeperTitle(campaign){
 if(campaign.leaks===0)return 'THE UNBROKEN WATCH';
 if(campaign.repairs>=5)return 'THE MENDING KEEPER';
 if(campaign.kills>=150)return 'THE RELENTLESS LIGHT';
 return 'THE LAST LIGHT KEEPER';
}
