T=10;
r=0.05
u=1.15;
d=1.01;
p=0.5;
So=50;
K=70;

pStar=(1+r-d)/(u-d);

x=0;
for k=0:T
    x=x+nchoosek(T,k)*pStar^k*(1-pStar)^(T-k)*max(u^k*d^(T-k)*So-K,0);
end

Co = x/((1+r)^T)
    