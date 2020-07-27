public abstract class ChartFactory {
    public static ChartTheme currentTheme;

    public ChartTheme getCurrentTheme(){
        return currentTheme;
    }

    public void setCurrentTheme(ChartTheme newTheme){
        currentTheme = newTheme;
    }

    public void createChart(int data){

    }

    public void createChart(String data){

    }

    public void createChart(boolean data){

    }
}