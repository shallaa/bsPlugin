bs['plugin+']( 'method', 'jpage', (function(){
	var cache={}, b = '<%', e = '%>', toCode, toHtml, arg, argstr, err, line, out, jpage,
	r0=/\\/g, r1=/["]|\n|\r\n|\r/g, r2=/at /g, r3=/["]|[<]|\t|[ ][ ]|\n|\r\n|\r/g, r4 = /\n|\r\n|\r/g, r5=/[<]|\t|[ ][ ]/g,
	e0 = '$$E[$$E.length]="<%', e1 = '%>";', e2 = 'OUT($$E[$$E.length]="', e3 = '"),$$L[0]+=', e4 = '}catch(e){return e;}';
	
	return toCode = function(_0){
		switch(_0){
		case'"':return '\\"';
		case'\n':case'\r\n':case'\r':return '\\n';
		default:return _0;
		}
	},
	toHtml = function(_0){
		switch(_0){
		case'"':return '\\"';
		case'<':return '&lt;';
		case'\t':return '&nbsp; &nbsp; ';
		case'  ':return '&nbsp; ';
		case'\n':case'\r\n':case'\r':return '<br>';
		default:return _0;
		}
	},
	argstr = 'bs,OUT,$$E,$$L', arg = [bs, function(v){out += v;}, err = [], line = []],
	jpage = function( tmpl, data, cacheId ){
		var param, t0, i, j, k, v, m;
		if( !( v = cache[cacheId] ) ){
			str = tmpl.split(b), v = 'try{', i = 0, j = str.length;
			while( i < j ){
				t0 = str[i++];
				if( ( k = t0.indexOf(e) ) > -1 ) t1 = t0.substring( 0, k ), t0 = t0.substr( k + 2 ), v += e0 + 
						t1.replace( r0, '\\\\' ).replace( r3, toHtml ) + e1 + //XX<%처리
						( t1.charAt(0) == '=' ? 'OUT(' + t1.substr(1) + ')' : t1 ) + //<%=XX처리
						';$$L[0]+=' + t1.split(r2).length + ';'; //줄번호기록
				v += e2 + t0.replace( r0, '\\\\' ).replace( r1, toCode ) + e3 + t0.split(r4).length + ';'; //출력처리
			}
			v += e4; //예외마감
			if( cacheId ) cache[cacheId] = v;
		}
		out = '', line[0] = err.length = 0, arg.length = 4, param = argstr;
		if( data ) for( k in data ) if( data.hasOwnProperty(k) ) param += ',' + k, arg[arg.length] = data[k];
		try{
			i = ( new Function( param, v ) ).apply( null, arg );
			if( !( i instanceof Error ) ) i = 0;
		}catch(e){i = e;}
		if( i ){
			t0 = '<h1>Invalid template error: bs.jpage</h1><hr>';
			if( m = err.length ) t0 += '<b>code: </b>error occured line number - ' + line[0] + '<br>' + err[err.length - 1] + '<hr>';
			j = Object.getOwnPropertyNames(i), k = j.length;
			while( k-- ) t0 += '<b>' + j[k] +'</b>: ' + ( i[j[k]].replace ? i[j[k]].replace( r2, '<br>at ' ) : i[j[k]] ) + '<br>';
			t0 += '<hr><b>template:</b><br>';
			for( k = v.split(r4), i = 0, j = k.length ; i < j ; i++ ) t0 += '<div'+( m && ( i + 1 == line[0] )?' style="background:#faa"' : '' ) + '><b>' + ( i + 1 ) + ':</b> ' + k[i].replace( r5, toHtml ) + '</div>';
			return t0;
		}
		return out;
	};
})() );