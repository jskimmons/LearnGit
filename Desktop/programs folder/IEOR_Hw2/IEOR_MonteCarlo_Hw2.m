n = input('How many trials?');
r=0.05;
u=1.15;
d=1.01;
p=0.5;
So=50;
T=10;
pStar = (1+r-d)/(u-d);
K=70;
Ct=0;

for i=1:n
    S = So;
    for t=1:T
        z=rand();
        if z <= pStar
            S=S*u;
        else
            S=S*d;
        end
    end
    Ct=Ct+max(S-K,0);
end

Co = (Ct/n)/((1+r)^T)