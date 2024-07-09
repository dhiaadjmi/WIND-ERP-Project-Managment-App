package winderp.authentication.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import winderp.authentication.user.User;
import winderp.authentication.user.UserRepository;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    private final UserRepository userRepository;

    public JwtService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private static final String SECRET_KEY="Ig8M1H7MkTwgAwb1W9rq4GUqWvGyr0RhcTI1EjjigL7EgISWKBKMuL3ol0AQGJhK";
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    public Integer extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", Integer.class));
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
  /**  public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }
   */
  public String generateToken(User user) {
      return generateToken(new HashMap<>(), user);
  }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
  /**  public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails
    ) {

        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())


                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 24))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();

    }
   */
  public String generateToken(Map<String, Object> extraClaims, User user) {
      return Jwts.builder()
              .setClaims(extraClaims)
              .claim("userId", user.getId())
              .claim("role", user.getRole().name())
              .claim("companyIdentifier",user.getCompanyIdentifier())
              .setSubject(user.getUsername())
              .setIssuedAt(new Date(System.currentTimeMillis()))
              .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 24))
              .signWith(getSignInKey(), SignatureAlgorithm.HS256)
              .compact();
  }


    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
