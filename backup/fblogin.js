bs.$register( 'static', 'fb', (function(){
	var fb;
	fb = function(){
		var t0, i, j;
		i = 0, j = arguments.length;
		if( j == 1 ) return fb.res[arguments[0]];
		t0 = {length:j};
		while( i < j ) t0[i] = fb.res[arguments[i]], i++;
		return t0;
	},
	fb.connected = function( $appid, $conn, $disconn ){
		if( !window.fbAsyncInit ) window.fbAsyncInit = function(){
			FB.init({appId:$appid,status:true,cookie:true,xfbml:true }),
			FB.getLoginStatus( function( $res ){
				if( $res.status=='connected' ) FB.api( '/me', function( $res0 ){
					FB.api( $res0.id + '/picture', function( $res1 ){$res0.url = $res1.data.url, $conn( fb.res = $res0 );} );
				} );
				else $disconn();
			});
		};
		if( !bs.WIN.is( '#facebook-jssdk' )	) bs.$js( function(){}, '//connect.facebook.net/en_US/all.js' );
	},
	fb.login = function(){FB.login();},
	fb.logout = function(){FB.logout();};
	return fb;
})(), 1.0 );