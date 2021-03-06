// https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
var resLoaded = 0, linkUrls = {}, rQuoteHead = /\n>\s/g, rln = /\n|\r\n|\r/gm,
synts = [
{r:/^\[(.*)\]:\s?(.*)\n/gm, t:function( org, k, v ){// linkUrls
	return linkUrls['"' + k.toLowerCase() + '"'] = v, '';
}},
{r:/^>\s(.*)((\n>\s.*)*)/gm, t:function( org, v1, v2 ){// Blockquotes
	return '<blockquote class="bsmarkdown">' + ( v1 + v2.replace( rQuoteHead, ' ' ) ) + '</blockquote>';
}},
{r:/^(.*)$\n={6,}/gm, t:'<h1 class="bsmarkdown">$1</h1>'},// alt-h1
{r:/^(.*)$\n-{6,}/gm, t:'<h2 class="bsmarkdown">$1</h2>'},// alt-h2
{r:/^#{6}\s(.*)$/gm, t:'<h6 class="bsmarkdown">$1</h6>'},// h6
{r:/^#{5}\s(.*)$/gm, t:'<h5 class="bsmarkdown">$1</h5>'},// h5
{r:/^#{4}\s(.*)$/gm, t:'<h4 class="bsmarkdown">$1</h4>'},// h4
{r:/^#{3}\s(.*)$/gm, t:'<h3 class="bsmarkdown">$1</h3>'},// h3
{r:/^#{2}\s(.*)$/gm, t:'<h2 class="bsmarkdown">$1</h2>'},// h2
{r:/^#{1}\s(.*)$/gm, t:'<h1 class="bsmarkdown">$1</h1>'},// h1
{r:/^[-\*_]{3,}$/gm, t:'<hr class="bsmarkdown">'},// hr
{r:/\*\*(.*)\*\*/gm, t:'<strong class="bsmarkdown">$1</strong>'},// strong
{r:/^```(.*)\n([ㄱ-ㅎㅏ-ㅣ가-힣\w\s\*=<>,\.:;~!@#$%^&\-+"'\(\)\[\]{}/]*)```$/gm, t:(function(){
	var re1 = /&/g, re2 = />/g, re3 = /</g,
		re4 = /"/g, //"
		re5 = /'/g, //'
		syntax = {
			html: 'html',
			javascript: 'js',
			php: 'php'
		};
	return function(org, s1, s2){
		return '<pre class="bsmarkdown"><code class="' + (syntax[s1] || 'js') + '">' + (!s2 ? '' : s2.replace( re1, '&amp;' )
			.replace( re2, '&gt;' ).replace( re3, '&lt;' ).replace( re4, '&quot;' ).replace( re5, '&apos;' )) + '</code></pre>';
	}
})()},// code
{r:/```(.*)```/gm, t:(function(){
	var re1 = /&/g, re2 = />/g, re3 = /</g,
		re4 = /"/g, //"
		re5 = /'/g;
	return function(org, s1){
		return '<code class="bsmarkdown">' + (!s1 ? '' : s1.replace( re1, '&amp;' )
			.replace( re2, '&gt;' ).replace( re3, '&lt;' ).replace( re4, '&quot;' ).replace( re5, '&apos;' )) + '</code>';
	}
})()},// pre, code
{r:/__(.*)__/gm, t:'<strong class="bsmarkdown">$1</strong>'},// strong
{r:/~~(.*)~~/gm, t:'<del class="bsmarkdown">$1</del>'},// strong
{r:/_(.*)_/gm, t:'<em class="bsmarkdown">$1</em>'},// em
{r:/\*(.*)\*/gm, t:'<em class="bsmarkdown">$1</em>'},// em
{r:/\s{2,}$/gm, t:'<br />'},// br
{r:/\!(\[(.*)\])?\[(.*)\]/gm, t:function( org, s1, alt, k ){// img ![][]
	return '!' + (alt ? '[' + alt + ']' : '') + '(' + linkUrls['"' + k.toLowerCase() + '"'] + ')';
}},
{r:/\!(\[(.*)\])?\((\S*)\s?(.*)?\)/gm, t:function( org, s1, alt, src, title ){// img ![]()
	return '<img class="bsmarkdown" src="' + src + (alt ? '" alt="' + alt : '') + (title ? '" title=' + title : '') + '></img>';
}},
{r:/\[(.*)\]\[(.*)\]/gm, t:function( org, v, k ){// link [][]
	var t0 = linkUrls['"' + k.toLowerCase() + '"'];
	return t0 ? '<a class="bsmarkdown" href="' + t0 + '">' + v + '</a>' : org;
}},
{r:/\[(.*)\]\((.*)\)/gm, t:'<a href="$2">$1</a>'},// link []()
{r:/\[(.*)\]/gm, t:function( org, k ){// link []
	var t0 = linkUrls['"' + k.toLowerCase() + '"'];
	return t0 ? '<a class="bsmarkdown" href="' + t0 + '">' + k + '</a>' : org;
}},
{r:/^(\s{0,})[\*\+-]{1}\s(.*)((\n{1}\s{0,}[\*\+-]{1}\s.+)*)/gm, t:(function(){
	var rInfo = /^(\s{0,})[\*\+-]{1}\s(.*)/;
	return function( org, v0, v1, v2 ){
		var ret, rsps, psps, nsps, sps, spsln, cntnt, t0, t1, i, j;
		for( ret = '<li class="bsmarkdown">' + v1 + '</li>', rsps = v0, psps = -1, t0 = v2.split('\n'), i = 1, j = t0.length; i < j; i++ ){
			t1 = rInfo.exec(t0[i]), sps = t1[1], spsln = sps.length, cntnt = t1[2],
			nsps = i < j - 1 ? rInfo.exec(t0[i+1])[1].length : -1;
			if( sps != rsps && spsln > psps ) ret += '<ul class="bsmarkdown">';
			ret += '<li class="bsmarkdown">' + cntnt + '</li>';
			if( sps != rsps ){
				if( spsln > nsps ) ret += '</ul>';
				psps = spsln;
			}
		}
		ret = '<ul class="bsmarkdown">' + ret + '</ul>\n';
		return ret;
	};
})()},
{r:/^(\s{0,})[\*\+-]{1}\s(.*)/gm, t:function( org, v0, v1, v2 ){
	var ret;
	ret = '<ul class="bsmarkdown"><li class="bsmarkdown">' + v1 + '</li></ul>';
	return ret;
}},
{r:/^(.*)\n{2}/gm, t:'<p class="bsmarkdown">$1</p>\n'}// p
];
exports.markdown = function(data){
	var t0, i, j;
	data = data.replace(rln, '\n');
	for( i = 0, j = synts.length; i < j; i++ ) t0 = synts[i], data = data.replace( t0.r, t0.t );
	if(!resLoaded){
		bs.js(function(){
				setTimeout(function(){
					hljs.initHighlighting();
				}, 500);
			},
			'http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.1/highlight.min.js'
		),
		bs.Dom('<link href="http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.1/styles/default.min.css" rel="stylesheet" type="text/css" />').S('<', bs.Dom('head')[0])
		resLoaded = 1;
	}else{
		setTimeout(function(){
			var el = bs.Dom('@pre code'), i = el.length;
			while(i--){hljs.highlightBlock(el[i]);}
		}, 500);
	}
	return data;
};