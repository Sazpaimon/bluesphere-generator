/*************************************************************************
 * This script originally from http://www.din.or.jp/~koryan/sonic/gbs_ca.htm
 * Credit and copywrite go to Koji Nishio, not me (DrSpud).
 * Images can be found at http://cgi.din.or.jp/~koryan/sonic/gbs/map/
 * Note that I corrected the pics for section 006 & made a number of
 * enhancements. Major or significant changes are marked with comments
 * in english.
 *
 * Any questions/comments about my version/implementation of this,
 * feel free to email me: DrSpud at mad dot scientist dot com
 ************************************************************************/

	//////////////////////////////////////////////////////////////////
	// Copyright(C) Koji NISHIO (Koryan) 2003 all rights reserved.	//
	// 無断転載厳禁！！							//
	//////////////////////////////////////////////////////////////////

/* 整数の除算(小数点以下切り捨て)の関数 div */
function div(a,b) {
	return Math.floor(a / b);
}


/* 入力数値が正常かどうかをチェックする関数 numcheck */
function numcheck(numr,numi,MIN,MAX){
	var chk = 0;

	/*  numr == "" is true in Firefox when it's 0, hence the '==='. */
	if ( numr === "" || isNaN(numr) || numi < MIN || numi > MAX || (numi != numr) ) {
//		window.alert(MIN + "〜" + MAX + " の整数を入力して下さい。");
		alert("Please enter a number from " + MIN + " to " + MAX);
		chk = 1;
	}

	return chk;
}


/* レベル数からコード番号を導出する関数 levtocod */
function levtocod(lev, sonic1cart){

  /* １：初期設定 */
	var ca = new Array(39);	//コード番号を計算するための２進(39桁)
	var cb = new Array(28);	//レベル数を２進にするための２進(28桁)
	var cc = new Array(0,0,0);	//最終的な10進コード番号を格納
	var tmp, cod, i, j;

	/* bit 38 is set later - affected by non-Sonic 1 carts */
//	ca[38] = 1;

  /* ２：２進数の(32)〜(27)桁目、(21)〜(1)桁目を求める */

    //「レベル数＋19,088,742」を２進に変換
	tmp = lev + 19088742;

	for (i = 0; i <= 27; i++){
		cb[i] = tmp % 2;
		tmp = div(tmp,2);
	}

    //上の２進を(位置を変えて)２進コードに格納
	for (i = 0; i <= 5 ; i++) ca[i+26] = cb[i];
	for (i = 6; i <= 26; i++) ca[i-6] = cb[i];

  /* ３：２進数の(38)〜(33)桁目、(26)〜(22)桁目を求める */

    //「レベル数−１」を２進に変換
	tmp = lev - 1;

	/* Non-Sonic 1 cart handling part 1 */
	if (!sonic1cart)
	{
		tmp += 0x07654321;
		tmp &= 0x07FFFFFF;
	}

	for (i = 0; i <= 27; i++){
		cb[i] = tmp % 2;
		tmp = div(tmp,2);
	}

    //一定の法則に従って２進コードを作成
	ca[38] = (sonic1cart ? 1 : 0);	/* Non-Sonic 1 cart handling part 2 */
	ca[37] = ( 1 + cb[6] + cb[23] ) % 2;
	ca[36] = ( 1 + cb[5] + cb[22] + cb[17] + cb[0] ) % 2;
	ca[35] = ( 1 + cb[4] + cb[21] + cb[16] ) % 2;
	ca[34] = ( 1 + cb[3] + cb[20] ) % 2;
	ca[33] = ( 1 + cb[2] + cb[19] ) % 2;
	ca[32] = ( 1 + cb[1] + cb[18] ) % 2;

	ca[25] = ( 0 + cb[11] + cb[16] ) % 2;
	ca[24] = ( 0 + cb[10] ) % 2;
	ca[23] = ( 0 + cb[9] + cb[26] ) % 2;
	ca[22] = ( 0 + cb[8] + cb[25] ) % 2;
	ca[21] = ( 0 + cb[7] + cb[24] ) % 2;

  /* ４：最終的なコード番号を求める */
    //奇数桁ビット反転
	for (i = 1; i < 38; i = i+2) ca[i] = 1 - ca[i];

    //コード番号を作成
	for (i = 38; i >= 0; i--){
		tmp = ca[i];
		for (j = 0; j <= 2; j++){
			cc[j] = cc[j] * 2 + tmp;
			if ( cc[j] > 9999 ){
				tmp = 1;
				cc[j] -= 10000;
			}
			else tmp = 0;
		}
	}

    //桁合わせ(コード番号(0000〜9999)を４桁に揃えて文字にする)
	for (i = 0; i <= 2; i++){
		if      (cc[i] < 10   ) cc[i]="000" + cc[i];
		else if (cc[i] < 100  ) cc[i]="00"  + cc[i];
		else if (cc[i] < 1000 ) cc[i]="0"   + cc[i];
		else                    cc[i]=""    + cc[i];
	}

//	cod = "" + cc[2] + " - " + cc[1] + " - " + cc[0];
	cod = "" + cc[2] + " " + cc[1] + " " + cc[0];
	return cod;
}


/* レベル数から部分マップ番号を導出する関数 levtopmn */
function levtopmn(lev){
	var pmn = new Array(4);

	pmn[0] = (lev - 1) % 128;
	pmn[1] = (1 + ((lev - 1) % 127) * 3) % 127;
	pmn[2] = (2 + ((lev - 1) % 126) * 5) % 126;
	pmn[3] = (3 + ((lev - 1) % 125) * 7) % 125;

	return pmn;
}


/* 部分マップ番号からステージ番号を導出する関数 pmntostg */
function pmntostg(pmn){
	var stg = 0;

	for (var i = 0; i <= 3; i++) stg = stg * 128 + pmn[i];

	return stg;
}


/* ステージ番号から部分マップ番号を導出する関数 stgtopmn */
function stgtopmn(stg){
	var pmn = new Array(4);

	for (var i = 3; i >= 0; i--){
		pmn[i] = stg % 128;
		stg = div(stg, 128);
	}

	return pmn;
}


/* 部分マップ番号から相当レベル数を導出する関数 pmntolev */
function pmntolev(pmn){
	var lev = pmn[0] + 1;
	var jug = 0;
	var tmp;

    //レベルに変換できるかどうか判定
	if ( pmn[1] > 126 || pmn[2] > 125 || pmn[3] > 124) jug = 1;
	if ( (pmn[0] + pmn[2]) % 2 != 0 ) jug = 1;  //[0]と[2]の偶奇が一致しないとダメ

	if (jug == 0){
		var pmnb = levtopmn(lev);
	    //ココまでで [0] が一致

		if (pmn[1] < pmnb[1]) pmn[1] += 127;
		tmp = ( pmn[1] - pmnb[1] ) % 3;
		if (tmp != 0) pmn[1] += 127 * (3 - tmp);
		lev += 128 * ((pmn[1] - pmnb[1]) / 3);
		pmnb = levtopmn(lev);
	    //ココまでで [0] [1] が一致

		if (pmn[2] < pmnb[2]) pmn[2] += 126;
		tmp = ( pmn[2] - pmnb[2] ) % 5;
		if (tmp != 0) pmn[2] += 126 * (5 - tmp);
		lev += 128 * 127 * ((pmn[2] - pmnb[2]) / 10);
		pmnb = levtopmn(lev);
	    //ココまでで [0] [1] [2] が一致

		tmp = 0;
		while (pmn[3] != pmnb[3]){
			pmn[3] -= 21;
			if ( pmn[3] < 0 ) pmn[3] += 125;
			tmp++;
		}
		lev += 128 * 127 * 63 * tmp;
	    //ココまでで [0] [1] [2] [3] が全て一致するハズ
	}
//	else lev = "なし";
	else lev = "(none)";

	return lev;
}


/* 部分マップ番号を文字列に変換する関数 chrpmn */
function chrpmn(pmn){
	var pmnc = new Array(4);

    //桁揃え
	for (var i = 0; i <= 3; i++){
		if      (pmn[i] < 10  ) pmnc[i]="00" + pmn[i];
		else if (pmn[i] < 100 ) pmnc[i]="0"  + pmn[i];
		else                    pmnc[i]=""   + pmn[i];
	}

	return pmnc;
}


/* ステージ番号を文字列に変換する関数 chrstg */
function chrstg(stg){
	var stgc = "";
	var keta;

    //桁揃え(ステージ番号(000,000,000〜268,435,455)を９桁に揃えて文字にする)
	keta=(stg != 0)?  Math.floor( Math.log(stg) / Math.log(10) ) + 1 : 1;
	for (var i = keta ; i < 9; i++) stgc += "0";
	stgc += stg;

	return stgc;
}

/* Optimize for batch mode: big arrays in global scope */
//                 | 0                     | 8                     |16                     |24                     |32                     |40                     |48                     |56                     |64                     |72                     |80                     |88                     |96                     |104                    |112                    |120                    |
var dbs = new Array(19, 8,20,29,27, 1, 2, 1,24,22, 2, 4,24, 6,17, 4,45,15,24, 9,10, 9, 7,15,40,12, 2, 3,29, 2,168,4,19,13, 3,15,13,24,13,39,20,37,51,39,29,27,23,15,11,28,38,14,26, 4, 1,16, 3, 2, 2,56,16,18,18,25,23,20,55, 4,29,12, 2,45, 1, 6, 2, 1,18, 3,28,20,23, 4,60,22,48,13, 2,35, 1, 5, 6,32,54, 7,24,22,48,34, 2,13,32, 5, 2,27,13,10, 4, 4,13, 5,18,25,17, 9,44,35, 4,44,30,56, 6,18,57, 4,17, 6,27, 5);
var drg = new Array(32, 3,20,26,18, 4, 1, 2,28, 2,11, 8,17, 2,10, 8,64,11,20,36, 3, 8,12,10,54,18, 1, 1,52, 1,164,4,26,14,10, 9,16, 2, 9,38, 9, 6,12,21, 4,18,22,17,17, 1, 2,48,22,16, 1, 4, 1,16, 6, 6,23, 9,14, 3,26,38,30,24,40, 5,12,45,12, 3,12, 6,20, 3,42,54,43,64,72,20,48,21,13,22,13,17,12,48,32,100,6, 2,45,32, 4,25,36, 4, 4,21,17, 9, 9, 2, 9, 1,16,18,11, 5,36,33, 9,40, 5,48, 2, 9, 1, 8, 9, 3,34, 4);
var ddf = new Array( 0, 2, 1, 1, 2, 1, 3, 3, 2, 1, 2, 0, 1, 3, 2, 2, 2, 1, 1, 3, 1, 1, 2, 2, 2, 3, 3, 3, 2, 1,  3,2, 1, 2, 2, 3, 1, 2, 2, 1, 2, 1, 2, 1, 2, 3, 1, 2, 3, 1, 1, 1, 1, 1, 3, 2, 3, 2, 1, 2, 2, 3, 2, 2, 1, 2, 2, 0, 1, 2, 1, 1, 2, 1, 0, 2, 0, 3, 2, 2, 2, 1, 1, 2, 1, 1, 1, 0, 1, 0, 2, 2, 3, 2, 2, 1, 0, 1, 2, 1, 2, 2, 2, 3, 2, 1, 2, 2, 3, 3, 3, 1, 3, 3, 0, 1, 3, 2, 2, 1, 3, 3, 2, 3, 3, 1, 2, 3);

/* 部分マップ番号から詳細データ(青球数・リング数・難易度)を導出する関数 pmntodat */
function pmntodat(pmn){
//	dat = new Array(0,0,1);
	var dat = new Array(0,0,1,0,0);

	for (var i = 0; i <= 3; i++){
		dat[0] += dbs[ pmn[i] ];
		dat[1] += drg[ pmn[i] ];
		dat[2] += ddf[ pmn[i] ];
	}

	/* Credit for pattern algorithm goes to Melanogaster -> http://boards.gamefaqs.com/gfaqs/user.php?board=6742&topic=13335352&user=567596
	 * as described here: http://boards.gamefaqs.com/gfaqs/genmessage.php?board=6742&topic=13335352 */
	dat[3] = pmn[2]%16;

	/* I Figured out the emerald algorithm myself, it's fairly simple */
	dat[4] = pmn[2]%8;

	if (dat[2] == 13) dat[2] = "MAX";
	return dat;
}

/* writepage and analyze functions rewritten & moved to bsprocess (for separation of generation & display) */
