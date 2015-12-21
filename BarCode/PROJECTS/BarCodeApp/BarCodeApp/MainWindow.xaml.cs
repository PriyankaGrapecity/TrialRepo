using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
//#region Namespace
using C1.BarCode;
//#endregion

namespace BarCodeApp
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            //#region SubscribeEvents
            this.Loaded += MainWindow_Loaded;
            cbCodeType.SelectionChanged += cbCodeType_SelectionChanged;
            text.TextChanged += text_TextChanged;
            //#endregion
        }

        //#region TextChangeEvent
        void text_TextChanged(object sender, TextChangedEventArgs e)
        {
            if (!string.IsNullOrEmpty(text.Text) &&
                text.Text.Equals("http://www.componentone.com") &&
                barcode.CodeType == CodeType.QRCode)
                image.Opacity = 1;
            else
                image.Opacity = 0;
        }
        //#endregion

        //#region ComboBoxSelectionChangeEvent
        void cbCodeType_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (barcode != null)
            {
                try
                {
                    barcode.CodeType = (CodeType)cbCodeType.SelectedItem;
                    if (barcode.CodeType != CodeType.QRCode
                        || !text.Text.Equals("http://www.componentone.com"))
                    {
                        image.Opacity = 1;
                    }
                    else
                    {
                        image.Opacity = 0;
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message);
                }
            }
        }
        //#endregion

        //#region MainWindowLoadEvent
        void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            cbCodeType.ItemsSource = Enum.GetValues(typeof(CodeType));
            cbCodeType.SelectedItem = barcode.CodeType;
        }
        //#endregion

    }    
      
}
  
